import { useNavigate, useParams } from 'react-router-dom';
import { ArticleDetail } from './ArticleDetailPage';
import { articles } from '@/mock/articles';

export function ArticleDetailWrapper() {
	const navigate = useNavigate();
	const { articleId } = useParams();
	
	const article = articles.find((a) => a.id === Number(articleId));

	if (!article) {
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

