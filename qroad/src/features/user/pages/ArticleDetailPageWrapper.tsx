import { useNavigate, useParams } from 'react-router-dom';
import { ArticleDetail } from './ArticleDetailPage';
import { useArticleDetail } from '@/hooks/user/useLandingPage';
import { Loader2 } from 'lucide-react';

export function ArticleDetailWrapper() {
  const navigate = useNavigate();
  const { articleId } = useParams();
  const { data: article, isLoading, error } = useArticleDetail(Number(articleId));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-[#2563EB] animate-spin mx-auto mb-4" />
          <p className="text-[#4B5563] text-[14px]">기사를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4">
        <div className="w-full max-w-[375px] bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB] text-center">
          <p className="text-[#111827] font-medium mb-2">기사를 찾을 수 없습니다.</p>
          <p className="text-[14px] text-[#B91C1C] mb-4">{String(error ?? '')}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 rounded-full bg-[#2563EB] text-white text-sm font-semibold"
          >
            뒤로가기
          </button>
        </div>
      </div>
    );
  }

  return <ArticleDetail article={article} onBack={() => navigate(-1)} />;
}
