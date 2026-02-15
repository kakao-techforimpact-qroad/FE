import apiClient, { unwrapResponse } from '../client';
import {
    CreatePublicationRequest,
    CreatePublicationResponse,
    PublicationDetailResponse,
    PublicationListResponse,
    PublicationProgressResponse,
} from '@/types/admin';

export const publicationsApi = {
    create: async (data: CreatePublicationRequest): Promise<CreatePublicationResponse> => {
        const normalizedFilePath =
            typeof data.filePath === 'string' && data.filePath.trim().length > 0
                ? data.filePath
                : 'temp/manual-upload.txt';

        const res = await apiClient.post('/api/admin/publications', {
            title: data.title,
            content: data.content,
            publishedDate: data.publishedDate,
            filePath: normalizedFilePath,
        });
        return unwrapResponse(res) as CreatePublicationResponse;
    },

    getProgress: async (jobId: string): Promise<PublicationProgressResponse> => {
        const res = await apiClient.get(`/api/admin/publications/${jobId}/progress`);
        return unwrapResponse(res) as PublicationProgressResponse;
    },

    getAll: async (params: { page?: number; limit?: number } = {}): Promise<PublicationListResponse> => {
        const { page = 1, limit = 10 } = params;
        const res = await apiClient.get('/api/admin/publications', { params: { page, limit } });
        const body = unwrapResponse(res) as PublicationListResponse | undefined;
        return body ?? { total_count: 0, papers: [] };
    },

    getById: async (paperId: number): Promise<PublicationDetailResponse> => {
        const res = await apiClient.get(`/api/admin/publications/${paperId}`);
        return unwrapResponse(res) as PublicationDetailResponse;
    },

    updateArticle: async (articleId: number, data: { summary: string; keywords: string[] }) => {
        const res = await apiClient.post(`/api/admin/articles/${articleId}`, data);
        return unwrapResponse(res);
    },

    generateQR: async (paperId: number) => {
        const res = await apiClient.post(`/api/admin/qr/${paperId}`);
        return unwrapResponse(res);
    },
};
