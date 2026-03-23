import apiClient, { unwrapResponse } from '../client';
import { UserLandingPageResponse, ArticleDetailResponse, CreateReportRequest, CreateReportResponse, CreateEmotionRequest, CreateEmotionResponse } from '@/types/admin';

export const userApi = {
    getLandingPage: async (paperId: number): Promise<UserLandingPageResponse> => {
        const res = await apiClient.get(`/api/qr/${paperId}`, { params: { paper_id: paperId } });
        return unwrapResponse(res) as UserLandingPageResponse;
    },

    getArticleDetail: async (articleId: number): Promise<ArticleDetailResponse> => {
        const res = await apiClient.get(`/api/articles/${articleId}`);
        return unwrapResponse(res) as ArticleDetailResponse;
    },

    createReport: async (payload: CreateReportRequest): Promise<CreateReportResponse> => {
        const res = await apiClient.post('/api/reports', payload);
        return unwrapResponse(res) as CreateReportResponse;
    },

    toggleEmotion: async (articleId: number, payload: CreateEmotionRequest): Promise<CreateEmotionResponse> => {
        const res = await apiClient.post(`/api/articles/${articleId}/emotions`, payload);
        return unwrapResponse(res) as CreateEmotionResponse;
    },
};
