import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UploadCloud, Info } from 'lucide-react';
import { publicationsApi } from '@/api/admin/publications';
import { useCreatePublication } from '@/hooks/admin/usePublications';
import { Button } from '@/shared/components/ui/button';
import { Progress } from '@/shared/components/ui/progress';
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
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
        <div className="w-full min-h-full bg-[#F9FAFB] flex font-['Inter'] relative">
            <div className="w-full p-[48px] overflow-x-auto">
                {/* Header Section */}
                <div 
                    className="flex items-center gap-[8px] cursor-pointer w-fit mb-[16px]" 
                    onClick={() => navigate('/admin/issues')}
                >
                    <ArrowLeft className="w-[12px] h-[14px] text-[#2563EB]" />
                    <span className="font-normal text-[14px] leading-[20px] tracking-[-0.5px] text-[#2563EB]">
                        이전으로 돌아가기
                    </span>
                </div>
                <h1 className="font-normal text-[36px] leading-[40px] tracking-[-0.5px] text-[#2563EB] mb-[10px]">
                    QR 발행
                </h1>
                <p className="font-normal text-[16px] leading-[24px] tracking-[-0.5px] text-[#4B5563] mb-[66px]">
                    주간 신문에 대한 QR을 발행합니다. AI가 자동으로 내용을 분석하여 정보를 제공합니다.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-[24px]">
                    
                    {/* Info Input Box */}
                    <div className="w-full max-w-[1304px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] px-[33px] py-[35px]">
                        <h3 className="font-normal text-[20px] leading-[28px] tracking-[-0.5px] text-[#111827] mb-[22px]">
                            정보 입력
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-[24px] mb-[24px]">
                            <div className="flex flex-col gap-[8px]">
                                <label className="font-normal text-[14px] leading-[17px] tracking-[-0.5px] text-[#374151]">
                                    호수/제목
                                </label>
                                <input 
                                    type="text"
                                    value={issueNum}
                                    onChange={(e) => setIssueNum(e.target.value)}
                                    placeholder="예: 제123호 - 지역 소식"
                                    className="w-full h-[48px] bg-[#FFFFFF] border border-[#D1D5DB] rounded-[8px] px-[16px] text-[#000000] placeholder-black/50 outline-none focus:border-[#2563EB]"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-[8px]">
                                <label className="font-normal text-[14px] leading-[17px] tracking-[-0.5px] text-[#374151]">
                                    발행일
                                </label>
                                <input 
                                    type="date"
                                    value={issueDate}
                                    onChange={(e) => setIssueDate(e.target.value)}
                                    className="w-full h-[48px] bg-[#FFFFFF] border border-[#D1D5DB] rounded-[8px] px-[16px] text-[#000000] placeholder-black/50 outline-none focus:border-[#2563EB]"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-[8px]">
                            <label className="font-normal text-[14px] leading-[17px] tracking-[-0.5px] text-[#374151]">
                                기사 원문
                            </label>
                            <textarea 
                                value={rawText}
                                onChange={(e) => setRawText(e.target.value)}
                                className="w-full min-h-[300px] bg-[#FFFFFF] border border-[#D1D5DB] rounded-[8px] p-[16px] text-[#000000] placeholder-black/50 outline-none focus:border-[#2563EB] resize-y"
                                required
                            />
                        </div>
                    </div>

                    {/* PDF Upload Box */}
                    <div className="w-full max-w-[1304px] h-[420px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] px-[33px] py-[33px] flex flex-col">
                        <h3 className="font-normal text-[16px] leading-[24px] tracking-[-0.5px] text-[#111827]">
                            지면 PDF 업로드
                        </h3>
                        <p className="font-normal text-[12px] leading-[16px] tracking-[-0.5px] text-[#6B7280] mb-[16px]">
                            통합 PDF 한 장으로 AI가 분석합니다
                        </p>

                        <div className="w-full h-[282px] bg-[#F9FAFB] border-[2px] border-dashed border-[#D1D5DB] rounded-[8px] flex flex-col items-center justify-center relative">
                            <input 
                                type="file" 
                                accept="application/pdf"
                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <UploadCloud className="w-[45px] h-[36px] text-[#9CA3AF] mb-[10px]" />
                            <p className="font-normal text-[16px] leading-[24px] tracking-[-0.5px] text-[#374151]">
                                {selectedFile ? selectedFile.name : '파일을 선택하거나 여기에 끌어다 놓으세요'}
                            </p>
                            <p className="font-normal text-[12px] leading-[16px] tracking-[-0.5px] text-[#6B7280] mt-[8px] mb-[32px]">
                                한 개의 파일만 선택, 50MB 이하
                            </p>
                            <button type="button" className="pointer-events-none w-[138px] h-[46px] bg-[#FFFFFF] border border-[#D1D5DB] rounded-[8px] font-normal text-[14px] leading-[17px] tracking-[-0.5px] text-[#374151]">
                                파일 선택하기
                            </button>
                        </div>
                    </div>

                    {/* Status progress rendering */}
                    {status !== 'IDLE' && (
                        <div className="w-full max-w-[1304px] space-y-3 rounded-[8px] border border-[#DBEAFE] bg-[#EFF6FF] p-4 text-[#1E3A8A]">
                            <div className="flex items-center justify-between text-sm font-medium">
                                <span>진행률</span>
                                <span>{progress}%</span>
                            </div>
                            <Progress value={progress} />
                            <p className="text-sm">{message}</p>
                            {jobId && <p className="text-xs opacity-70">Job ID: {jobId}</p>}
                            {status === 'FAILED' && error && <p className="text-sm text-red-600">{error}</p>}
                            {status === 'FAILED' && (
                                <Button type="button" variant="outline" onClick={startPublicationJob} className="w-fit">
                                    재시도
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Warning Box */}
                    <div className="w-full max-w-[1304px] h-[74px] bg-[#EFF6FF] border border-[#BFDBFE] rounded-[8px] p-[17px] flex items-center gap-[12px]">
                        <Info className="w-[16px] h-[16px] text-[#2563EB] mb-auto mt-[4px]" />
                        <div className="flex flex-col gap-[4px]">
                            <p className="font-normal text-[14px] leading-[20px] tracking-[-0.5px] text-[#1E3A8A]">
                                발행하기 클릭 후 AI 분석으로 인해 몇 분 정도 소요될 수 있습니다.
                            </p>
                            <p className="font-normal text-[12px] leading-[16px] tracking-[-0.5px] text-[#374151]">
                                PDF는 한 파일만 업로드 가능하며, 한 파일 내에 모든 지면 내용이 포함되어야 합니다.
                            </p>
                        </div>
                    </div>

                    {/* Submit / Cancel Buttons */}
                    <div className="w-full max-w-[1304px] flex justify-end gap-[12px] mb-[48px]">
                        <button 
                            type="button" 
                            onClick={() => navigate('/admin/issues')} 
                            disabled={isLoading}
                            className="w-[82px] h-[50px] bg-[#FFFFFF] border border-[#D1D5DB] rounded-[8px] font-normal text-[16px] leading-[20px] tracking-[-0.5px] text-[#374151] flex items-center justify-center hover:bg-[#F9FAFB] transition-colors"
                        >
                            취소
                        </button>
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className={`w-[136px] h-[50px] ${isLoading ? 'bg-[#9CA3AF]' : 'bg-[#2563EB] hover:bg-[#1D4ED8]'} text-[#FFFFFF] font-normal text-[16px] leading-[20px] tracking-[-0.5px] rounded-[8px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] flex items-center justify-center transition-colors`}
                        >
                            {isLoading ? `진행 중... ${progress}%` : '발행하기'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

