import apiClient from '../client';
import { UserLandingPageResponse, ArticleDetailResponse } from '@/types/admin';

export const userApi = {
    // User Landing Page 데이터 조회
    getLandingPage: async (paperId: number): Promise<UserLandingPageResponse> => {
        return apiClient.get(`/api/qr/${paperId}`, {
            params: { paper_id: paperId },
        });
    },

    // Article 상세 조회
    getArticleDetail: async (articleId: number): Promise<ArticleDetailResponse> => {
        return apiClient.get(`/api/articles/${articleId}`);
    },
};
