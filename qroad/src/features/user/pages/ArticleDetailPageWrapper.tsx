import { useNavigate, useParams } from 'react-router-dom';
import { ArticleDetail } from './ArticleDetailPage';
import { useArticleDetail } from '@/hooks/user/useLandingPage';
import { Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from '@/shared/components/ui/alert-dialog';

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
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center">
        <div className="w-full max-w-[375px] bg-white relative min-h-screen shadow-sm" />
        <AlertDialog open={true} onOpenChange={(open) => { if (!open) navigate(-1); }}>
          <AlertDialogContent className="w-[90%] max-w-[340px] rounded-[16px]">
            <AlertDialogHeader>
              <AlertDialogTitle>기사를 찾을 수 없습니다</AlertDialogTitle>
              <AlertDialogDescription>
                {String(error ?? '기사 데이터가 존재하지 않습니다.')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => navigate(-1)} className="bg-[#2563EB] text-white">
                확인
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return <ArticleDetail article={article} onBack={() => navigate(-1)} />;
}
