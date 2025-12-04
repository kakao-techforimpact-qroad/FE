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
			<div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 flex items-center justify-center">
				<div className="text-center">
					<Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
					<p className="text-gray-600">기사를 불러오는 중...</p>
				</div>
			</div>
		);
	}

	if (error || !article) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 flex items-center justify-center px-6">
				<div className="text-center space-y-4">
					<p className="text-foreground/80 text-lg font-semibold">기사를 찾을 수 없습니다.</p>
					<button
						onClick={() => navigate(-1)}
						className="px-6 py-2 rounded-full bg-violet-600 text-white text-sm font-semibold"
					>
						뒤로가기
					</button>
				</div>
			</div>
		);
	}

	return (
		<ArticleDetail
			article={article}
			onBack={() => navigate(-1)}
		/>
	);
}
