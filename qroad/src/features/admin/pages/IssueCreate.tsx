import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Send, Sparkles } from 'lucide-react';
import { publicationsApi } from '@/api/admin/publications';
import { useCreatePublication } from '@/hooks/admin/usePublications';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Progress } from '@/shared/components/ui/progress';
import { Textarea } from '@/shared/components/ui/textarea';
import { PublicationProgressResponse } from '@/types/admin';
import { toast } from 'sonner';

type CreationStatus = 'IDLE' | 'PROCESSING' | 'DONE' | 'FAILED';

const POLLING_INTERVAL_MS = 2000;
const POLLING_TIMEOUT_MS = 10 * 60 * 1000;

export const IssueCreate = () => {
    const navigate = useNavigate();
    const createMutation = useCreatePublication();

    const [issueNum, setIssueNum] = useState('');
    const [issueDate, setIssueDate] = useState('');
    const [rawText, setRawText] = useState('');

    const [jobId, setJobId] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<CreationStatus>('IDLE');
    const [error, setError] = useState<string | null>(null);
    const [startTime, setStartTime] = useState<number | null>(null);

    // setInterval id를 보관해 중복 polling과 메모리 누수를 방지한다.
    const intervalRef = useRef<number | null>(null);

    const isLoading = createMutation.isPending || status === 'PROCESSING';

    const clearPolling = useCallback(() => {
        if (intervalRef.current !== null) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const stopWithFailure = useCallback(
        (errorMessage: string) => {
            clearPolling();
            setStatus('FAILED');
            setError(errorMessage);
            setMessage(errorMessage);
        },
        [clearPolling]
    );

    const extractPaperId = (progressData: PublicationProgressResponse): number | null => {
        // 백엔드 응답 스키마 차이(paperId / paper_id / result.paperId)를 모두 허용한다.
        const maybePaperId =
            progressData.paperId ??
            progressData.paper_id ??
            (progressData as any)?.result?.paperId ??
            (progressData as any)?.result?.paper_id;

        return typeof maybePaperId === 'number' ? maybePaperId : null;
    };

    const startPublicationJob = useCallback(async () => {
        if (status === 'PROCESSING') {
            return;
        }

        if (!issueDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
            toast.error('올바른 날짜 형식(YYYY-MM-DD)을 입력해주세요.');
            return;
        }

        // 새 작업 시작 전에 이전 polling 상태를 초기화한다.
        clearPolling();
        setError(null);
        setStatus('IDLE');
        setProgress(0);
        setMessage('작업 시작 요청 중입니다...');
        setJobId(null);

        try {
            const response = await createMutation.mutateAsync({
                title: issueNum,
                content: rawText,
                publishedDate: issueDate,
            });

            setJobId(response.jobId);
            setStartTime(Date.now());
            setStatus('PROCESSING');
            setMessage('작업이 시작되었습니다. 진행률을 조회합니다...');
        } catch (err: unknown) {
            const errorMessage = axios.isAxiosError(err)
                ? err.response?.data?.message || '기사 발행 시작에 실패했습니다.'
                : '기사 발행 시작에 실패했습니다.';

            setStatus('FAILED');
            setError(errorMessage);
            setMessage(errorMessage);
        }
    }, [clearPolling, createMutation, issueDate, issueNum, rawText, status]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await startPublicationJob();
    };

    useEffect(() => {
        if (!jobId || status !== 'PROCESSING' || startTime === null) {
            return;
        }

        const fetchProgress = async () => {
            try {
                const data = await publicationsApi.getProgress(jobId);
                const normalizedProgress = Math.min(100, Math.max(0, data.progress));
                const terminal =
                    data.status === 'DONE' || data.status === 'FAILED' || normalizedProgress >= 100;

                setProgress(normalizedProgress);
                setMessage(data.message || '진행 중입니다...');

                if (!terminal) {
                    return;
                }

                clearPolling();

                if (data.status === 'FAILED') {
                    const failedMessage = data.message || '기사 발행 작업이 실패했습니다.';
                    setStatus('FAILED');
                    setError(failedMessage);
                    toast.error(failedMessage);
                    return;
                }

                const paperId = extractPaperId(data);
                if (!paperId) {
                    stopWithFailure('작업은 완료되었지만 paperId를 받지 못했습니다.');
                    return;
                }

                setStatus('DONE');
                setProgress(100);
                setError(null);
                toast.success('기사 발행이 완료되었습니다.');
                navigate(`/admin/issues/${paperId}`);
            } catch (err: unknown) {
                if (axios.isAxiosError(err) && err.response?.status === 404) {
                    const notFoundMessage = '작업이 만료되었거나 존재하지 않습니다';
                    stopWithFailure(notFoundMessage);
                    return;
                }

                // 네트워크 오류는 polling을 유지하고 로그만 남긴다.
                console.error('진행률 조회 중 네트워크 오류가 발생했습니다.', err);
            }
        };

        const runPolling = () => {
            // 무한 polling을 막기 위해 10분을 초과하면 강제 종료한다.
            if (Date.now() - startTime >= POLLING_TIMEOUT_MS) {
                stopWithFailure('작업 시간이 10분을 초과해 자동으로 중단되었습니다. 다시 시도해주세요.');
                return;
            }

            void fetchProgress();
        };

        runPolling();
        intervalRef.current = window.setInterval(runPolling, POLLING_INTERVAL_MS);

        return () => {
            clearPolling();
        };
    }, [clearPolling, jobId, navigate, startTime, status, stopWithFailure]);

    useEffect(() => {
        return () => {
            clearPolling();
        };
    }, [clearPolling]);

    return (
        <div className="p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
            >
                <div className="mb-8">
                    <Button
                        onClick={() => navigate('/admin/issues')}
                        variant="ghost"
                        className="mb-4 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                        disabled={isLoading}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        기사 이력으로 돌아가기
                    </Button>

                    <h1 className="text-4xl bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-3">
                        기사 발행
                    </h1>
                    <p className="text-gray-600">기사 원문을 입력한 뒤 발행 작업을 시작하세요.</p>
                </div>

                <Card className="shadow-xl border border-purple-100 overflow-hidden p-0">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-100 p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl text-gray-900">기사 정보 입력</CardTitle>
                                <CardDescription className="mt-1">필수 입력값을 모두 작성해주세요.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label htmlFor="issue_num" className="text-base">
                                        이슈명/제목 <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="issue_num"
                                        type="text"
                                        value={issueNum}
                                        onChange={(e) => setIssueNum(e.target.value)}
                                        className="border-purple-200 focus:border-purple-400 focus:ring-purple-400 h-12 text-base"
                                        required
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="issue_date" className="text-base">
                                        발행일자 <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="issue_date"
                                        type="date"
                                        value={issueDate}
                                        onChange={(e) => setIssueDate(e.target.value)}
                                        className="border-purple-200 focus:border-purple-400 focus:ring-purple-400 h-12 text-base"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="raw_text" className="text-base">
                                    기사 원문 <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="raw_text"
                                    value={rawText}
                                    onChange={(e) => setRawText(e.target.value)}
                                    className="border-purple-200 focus:border-purple-400 focus:ring-purple-400 min-h-[300px] text-base"
                                    required
                                />
                            </div>

                            {status !== 'IDLE' && (
                                <div className="space-y-3 rounded-lg border border-purple-200 bg-purple-50 p-4">
                                    <div className="flex items-center justify-between text-sm font-medium">
                                        <span>진행률</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <Progress value={progress} />
                                    <p className="text-sm text-gray-700">{message}</p>
                                    {jobId && <p className="text-xs text-gray-500">Job ID: {jobId}</p>}
                                    {status === 'FAILED' && error && <p className="text-sm text-red-600">{error}</p>}
                                    {status === 'FAILED' && (
                                        <Button type="button" variant="outline" onClick={startPublicationJob} className="w-fit">
                                            재시도
                                        </Button>
                                    )}
                                </div>
                            )}

                            <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate('/admin/issues')}
                                    disabled={isLoading}
                                    className="min-w-32 h-12"
                                    size="lg"
                                >
                                    취소
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 min-w-40 h-12 shadow-lg shadow-purple-500/30"
                                    disabled={isLoading}
                                    size="lg"
                                >
                                    {isLoading ? (
                                        <>
                                            <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                                            AI 처리 중... {progress}%
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5 mr-2" />
                                            기사 발행하기
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

