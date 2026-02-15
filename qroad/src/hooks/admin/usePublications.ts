import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { publicationsApi } from '@/api/admin/publications';
import { toast } from 'sonner';
import { CreatePublicationRequest } from '@/types/admin';

// 신문 목록 조회 Hook
export const usePublications = (params: { page?: number; limit?: number } = {}) => {
    return useQuery({
        queryKey: ['publications', params],
        queryFn: () => publicationsApi.getAll(params),
    });
};

// 신문 상세 조회 Hook
export const usePublication = (paperId: number) => {
    return useQuery({
        queryKey: ['publication', paperId],
        queryFn: () => publicationsApi.getById(paperId),
        enabled: !!paperId,
    });
};

// Starts async publication job and returns { jobId }.
export const useCreatePublication = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePublicationRequest) => publicationsApi.create(data),
        onSuccess: () => {
            // 생성 요청은 비동기 잡 시작만 담당하므로 목록 캐시만 갱신한다.
            queryClient.invalidateQueries({ queryKey: ['publications'] });
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || '기사 생성 중 오류가 발생했습니다';
            toast.error(errorMessage);
        },
    });
};

// Article 수정 Hook
export const useUpdateArticle = (paperId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ articleId, data }: { articleId: number; data: { summary: string; keywords: string[] } }) =>
            publicationsApi.updateArticle(articleId, data),
        onSuccess: () => {
            // Publication 상세 캐시 무효화
            queryClient.invalidateQueries({ queryKey: ['publication', paperId] });
            toast.success('Article을 수정했습니다');
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Article 수정 중 오류가 발생했습니다';
            toast.error(errorMessage);
        },
    });
};
