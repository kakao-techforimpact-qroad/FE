import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import apiClient, { unwrapResponse } from '@/api/client';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import { Spinner } from '@/shared/components/ui/spinner';

type JobStatus = 'IDLE' | 'PROCESSING' | 'DONE' | 'FAILED';
type ProgressStatus = 'PROCESSING' | 'DONE' | 'FAILED';

interface StartPublicationJobResponse {
    jobId: string;
}

interface PublicationJobProgressResponse {
    status: ProgressStatus;
    progress: number;
    message: string;
}

const POLLING_INTERVAL_MS = 2000;
const POLLING_TIMEOUT_MS = 10 * 60 * 1000;

export const PublicationJobRunner = () => {
    const [jobId, setJobId] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('작업을 시작해주세요.');
    const [status, setStatus] = useState<JobStatus>('IDLE');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [startTime, setStartTime] = useState<number | null>(null);

    const mountedRef = useRef(true);
    const intervalRef = useRef<number | null>(null);

    const clearPolling = useCallback(() => {
        if (intervalRef.current !== null) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const stopWithFailure = useCallback(
        (errorMessage: string) => {
            clearPolling();

            if (!mountedRef.current) {
                return;
            }

            setStatus('FAILED');
            setIsLoading(false);
            setError(errorMessage);
        },
        [clearPolling]
    );

    const fetchProgress = useCallback(
        async (targetJobId: string) => {
            try {
                const res = await apiClient.get(`/api/admin/publications/${targetJobId}/progress`);
                const data = unwrapResponse(res) as PublicationJobProgressResponse;

                if (!mountedRef.current) {
                    return;
                }

                const normalizedProgress = Math.min(100, Math.max(0, data.progress));
                const normalizedStatus: ProgressStatus =
                    data.progress >= 100 && data.status === 'PROCESSING' ? 'DONE' : data.status;

                setProgress(normalizedProgress);
                setMessage(data.message);
                setStatus(normalizedStatus);

                if (normalizedStatus === 'DONE' || normalizedStatus === 'FAILED' || normalizedProgress >= 100) {
                    clearPolling();
                    setIsLoading(false);
                    if (normalizedStatus === 'FAILED') {
                        setError(data.message || '작업에 실패했습니다.');
                    } else {
                        setError(null);
                    }
                }
            } catch (err: unknown) {
                if (!mountedRef.current) {
                    return;
                }

                if (axios.isAxiosError(err) && err.response?.status === 404) {
                    stopWithFailure('작업이 만료되었거나 존재하지 않습니다');
                    return;
                }

                // 네트워크 오류는 polling을 유지하되 로그만 남긴다.
                console.error('진행률 조회 중 오류가 발생했습니다.', err);
            }
        },
        [clearPolling, stopWithFailure]
    );

    const startJob = useCallback(async () => {
        if (status === 'PROCESSING') {
            return;
        }

        clearPolling();
        setError(null);
        setJobId(null);
        setProgress(0);
        setStatus('PROCESSING');
        setMessage('작업 시작 요청 중...');
        setIsLoading(true);

        try {
            const res = await apiClient.post('/api/admin/publications');
            const data = unwrapResponse(res) as StartPublicationJobResponse;
            const startedAt = Date.now();

            if (!mountedRef.current) {
                return;
            }

            setJobId(data.jobId);
            setStartTime(startedAt);
            setMessage('작업이 시작되었습니다. 진행률을 확인합니다...');
        } catch (err: unknown) {
            console.error('작업 시작 중 오류가 발생했습니다.', err);

            if (!mountedRef.current) {
                return;
            }

            setIsLoading(false);
            setStatus('FAILED');
            setError('작업 시작에 실패했습니다. 잠시 후 다시 시도해주세요.');
        }
    }, [clearPolling, status]);

    useEffect(() => {
        if (!jobId || status !== 'PROCESSING' || startTime === null) {
            return;
        }

        const runPolling = () => {
            if (Date.now() - startTime >= POLLING_TIMEOUT_MS) {
                stopWithFailure('작업 시간이 10분을 초과해 자동으로 중단되었습니다. 다시 시도해주세요.');
                return;
            }

            void fetchProgress(jobId);
        };

        runPolling();
        intervalRef.current = window.setInterval(runPolling, POLLING_INTERVAL_MS);

        return () => {
            clearPolling();
        };
    }, [clearPolling, fetchProgress, jobId, startTime, status, stopWithFailure]);

    useEffect(() => {
        return () => {
            mountedRef.current = false;
            clearPolling();
        };
    }, [clearPolling]);

    return (
        <Card className="w-full max-w-xl">
            <CardHeader>
                <CardTitle>관리자 발행 작업</CardTitle>
                <CardDescription>비동기 작업 상태를 2초마다 조회합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">진행률</span>
                        <span>{progress}%</span>
                    </div>
                    <Progress value={progress} />
                </div>

                <p className="text-sm text-gray-600">{message}</p>
                {jobId && <p className="text-xs text-gray-500">jobId: {jobId}</p>}

                {isLoading && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                        <Spinner className="size-4" />
                        <span>작업 진행 중...</span>
                    </div>
                )}

                {status === 'DONE' && (
                    <p className="text-sm font-medium text-green-600">작업이 완료되었습니다.</p>
                )}

                {status === 'FAILED' && error && (
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-red-600">{error}</p>
                        <Button type="button" onClick={startJob}>
                            재시도
                        </Button>
                    </div>
                )}

                <Button type="button" onClick={startJob} disabled={status === 'PROCESSING'}>
                    {status === 'PROCESSING' ? '작업 진행 중...' : '작업 시작'}
                </Button>
            </CardContent>
        </Card>
    );
};

