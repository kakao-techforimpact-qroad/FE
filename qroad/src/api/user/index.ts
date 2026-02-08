import apiClient, { unwrapResponse } from '../client';
import { UserLandingPageResponse, ArticleDetailResponse } from '@/types/admin';

export const userApi = {
    getLandingPage: async (paperId: number): Promise<UserLandingPageResponse> => {
        const res = await apiClient.get(`/api/qr/${paperId}`, { params: { paper_id: paperId } });
        return unwrapResponse(res) as UserLandingPageResponse;
    },

    getArticleDetail: async (articleId: number): Promise<ArticleDetailResponse> => {
        const res = await apiClient.get(`/api/articles/${articleId}`);
        return unwrapResponse(res) as ArticleDetailResponse;
    },
};
