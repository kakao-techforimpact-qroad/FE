import apiClient, { unwrapResponse } from '../client';
import {
    CreatePublicationRequest,
    CreatePublicationResponse,
    GetPublicationsParams,
    PublicationDetailResponse,
    PublicationListResponse,
    PublicationProgressResponse,
    PublicationUploadUrlRequest,
    PublicationUploadUrlResponse,
} from '@/types/admin';

export const publicationsApi = {
    create: async (data: CreatePublicationRequest): Promise<CreatePublicationResponse> => {
        const res = await apiClient.post('/api/admin/publications', {
            title: data.title,
            publishedDate: data.publishedDate,
            tempKey: data.tempKey,
        });
        return unwrapResponse(res) as CreatePublicationResponse;
    },

    requestUploadUrl: async (
        data: PublicationUploadUrlRequest
    ): Promise<PublicationUploadUrlResponse> => {
        const res = await apiClient.post('/api/admin/publications/upload-url', data);
        const body = unwrapResponse(res) as Record<string, unknown>;

        const uploadUrl =
            (body.uploadUrl as string | undefined) ??
            (body.presignedUrl as string | undefined) ??
            (body.url as string | undefined);
        const tempKey = (body.tempKey as string | undefined) ?? (body.key as string | undefined);

        if (!uploadUrl || !tempKey) {
            throw new Error('업로드 URL 발급 응답 형식이 올바르지 않습니다.');
        }

        return { uploadUrl, tempKey };
    },

    uploadPdfToS3: async (uploadUrl: string, file: File): Promise<void> => {
        const res = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': file.type || 'application/pdf',
            },
            body: file,
        });

        if (!res.ok) {
            throw new Error(`PDF 업로드에 실패했습니다. (${res.status})`);
        }
    },

    getProgress: async (jobId: string): Promise<PublicationProgressResponse> => {
        const res = await apiClient.get(`/api/admin/publications/${jobId}/progress`);
        return unwrapResponse(res) as PublicationProgressResponse;
    },

    getAll: async (params: GetPublicationsParams = {}): Promise<PublicationListResponse> => {
        const { page = 1, limit = 10, month, q } = params;
        const res = await apiClient.get('/api/admin/publications', {
            params: {
                page,
                limit,
                ...(month ? { month } : {}),
                ...(q ? { q } : {}),
            },
        });
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

