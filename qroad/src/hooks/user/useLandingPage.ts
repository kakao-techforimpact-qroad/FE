import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/api/user';

// User Landing Page 데이터 조회 Hook
export const useUserLandingPage = (paperId: number) => {
    return useQuery({
        queryKey: ['userLandingPage', paperId],
        queryFn: () => userApi.getLandingPage(paperId),
        enabled: !!paperId,
    });
};

// Article 상세 조회 Hook
export const useArticleDetail = (articleId: number) => {
    return useQuery({
        queryKey: ['articleDetail', articleId],
        queryFn: () => userApi.getArticleDetail(articleId),
        enabled: !!articleId,
    });
};
