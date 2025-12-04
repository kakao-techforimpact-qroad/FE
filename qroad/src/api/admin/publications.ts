import apiClient from '../client';
import { CreatePublicationRequest, CreatePublicationResponse, PublicationDetailResponse, PublicationListResponse } from '@/types/admin';

export const publicationsApi = {
    // 신문 생성
    create: async (data: CreatePublicationRequest): Promise<CreatePublicationResponse> => {
        return apiClient.post('/api/admin/publications', {
            title: data.title,
            content: data.content,
            publishedDate: data.publishedDate,
        });
    },

    // 신문 목록 조회
    getAll: async (params: { page?: number; limit?: number } = {}): Promise<PublicationListResponse> => {
        const { page = 1, limit = 10 } = params;
        return apiClient.get('/api/admin/publications', {
            params: { page, limit },
        });
    },

    // 신문 상세 조회
    getById: async (paperId: number): Promise<PublicationDetailResponse> => {
        return apiClient.get(`/api/admin/publications/${paperId}`);
    },

    // Article 수정
    updateArticle: async (articleId: number, data: { summary: string; keywords: string[] }) => {
        return apiClient.post(`/api/admin/articles/${articleId}`, data);
    },

    // QR 코드 생성 (추후 구현)
    generateQR: async (paperId: number) => {
        return apiClient.post(`/api/admin/qr/${paperId}`);
    },
};
