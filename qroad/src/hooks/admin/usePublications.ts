import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { publicationsApi } from '@/api/admin/publications';
import { toast } from 'sonner';
import { CreatePublicationRequest } from '@/types/admin';

export const usePublications = (params: { page?: number; limit?: number } = {}) => {
    return useQuery({
        queryKey: ['publications', params],
        queryFn: () => publicationsApi.getAll(params),
    });
};

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
            queryClient.invalidateQueries({ queryKey: ['publications'] });
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || '기사 생성 중 오류가 발생했습니다';
            toast.error(errorMessage);
        },
    });
};

export const useUpdateArticle = (paperId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ articleId, data }: { articleId: number; data: { summary: string; keywords: string[] } }) =>
            publicationsApi.updateArticle(articleId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['publication', paperId] });
            toast.success('Article을 수정했습니다');
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Article 수정 중 오류가 발생했습니다';
            toast.error(errorMessage);
        },
    });
};
