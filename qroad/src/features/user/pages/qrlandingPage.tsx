import { Sparkles, Loader2 } from "lucide-react";
import { ArticleCard } from '../components/ArticleCard';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserLandingPage } from '@/hooks/user/useLandingPage';

interface ArticleListProps {
	onArticleClick: (id: number) => void;
	articles: Array<{ id: number; title: string; summary?: string; author?: string }>;
	isLoading?: boolean;
}

export function ArticleList({ onArticleClick, articles, isLoading }: ArticleListProps) {
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

	return (
		<div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
			{/* Modern Purple Header */}
			<header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-purple-100 shadow-lg shadow-purple-500/5">
				<div className="max-w-md mx-auto px-6 py-6">
					<div className="relative flex items-center gap-4">
						{/* Animated gradient background */}
						<div className="absolute -inset-2 bg-gradient-to-r from-violet-600/10 via-purple-600/10 to-fuchsia-600/10 rounded-2xl blur-xl opacity-50" />

						{/* Logo icon with animation */}
						<div className="relative group">
							<div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity" />
							<div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-xl shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
								<Sparkles className="w-6 h-6 text-white animate-pulse" />
							</div>
						</div>

						{/* Logo text with enhanced gradient */}
						<div className="relative">
							<h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
								QRoad
							</h1>
							<div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-violet-600/0 via-purple-600/50 to-violet-600/0 rounded-full" />
						</div>

						{/* Decorative badge */}
						<div className="ml-2 px-3 py-1 bg-gradient-to-r from-violet-100 to-purple-100 rounded-full border border-purple-200">
							<span className="text-xs font-semibold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
								AI Powered
							</span>
						</div>
					</div>
				</div>
			</header>

			{/* Article List */}
			<main className="max-w-md mx-auto px-6 py-12 pb-32">
				<div className="space-y-5">
					{articles.map((article) => {
						// summary를 100자로 제한
						const summary = article.summary || article.title;
						const truncatedSummary = summary.length > 100
							? summary.slice(0, 100) + '...'
							: summary;

						return (
							<ArticleCard
								key={article.id}
								title={article.title}
								description={truncatedSummary}
								onClick={() => onArticleClick(article.id)}
							/>
						);
					})}
				</div>
			</main>

			{/* 구독 방법 버튼 - 하단 고정 */}
			<div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-white via-white to-transparent pt-6 pb-8">
				<div className="max-w-md mx-auto px-6">
					<a
						href="https://curly-marjoram-9d4.notion.site/2bbe6f94cb6d806281d6cfe611061601"
						className="block w-full group relative overflow-hidden"
					>
						{/* 배경 그라디언트 애니메이션 */}
						<div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300" />

						{/* 버튼 본체 */}
						<div className="relative bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-2xl shadow-2xl shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all duration-300 group-hover:scale-[1.02]">
							<div className="px-8 py-5 flex items-center justify-center gap-3">
								<Sparkles className="w-6 h-6 text-white animate-pulse" />
								<span className="text-lg font-bold text-white">
									옥천신문 구독방법
								</span>
							</div>
						</div>
					</a>
				</div>
			</div>
		</div>
	);
}

export function QRLandingPage() {
	const navigate = useNavigate();
	const { paperId } = useParams<{ paperId: string }>();
	const { data, isLoading, error } = useUserLandingPage(Number(paperId));

	const handleArticleClick = (id: number) => {
		navigate(`/article/${id}`);
	};

	// 에러 처리
	if (error) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 flex items-center justify-center p-4">
				<div className="text-center">
					<p className="text-gray-600">기사를 불러올 수 없습니다</p>
					<p className="text-sm text-red-500 mt-2">{String(error)}</p>
				</div>
			</div>
		);
	}

	// API 데이터를 ArticleCard에 맞는 형식으로 변환
	const articles = (data?.articleSimpleDTOS || []).map(article => ({
		id: article.id,
		title: article.title,
		summary: article.title, // API에 summary가 없으므로 title 사용
		author: undefined,
	}));

	return <ArticleList onArticleClick={handleArticleClick} articles={articles} isLoading={isLoading} />;
}
