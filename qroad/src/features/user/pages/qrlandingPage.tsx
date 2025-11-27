import { Sparkles } from "lucide-react";
import { ArticleCard } from '../components/ArticleCard';
import { articles } from '@/mock/articles';
import { useNavigate } from 'react-router-dom';

interface ArticleListProps {
	onArticleClick: (id: number) => void;
}

export function ArticleList({ onArticleClick }: ArticleListProps) {
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
		<main className="max-w-md mx-auto px-6 py-12">
		  <div className="space-y-5">
			{articles.map((article) => {
			  // summary를 100자로 제한
			  const truncatedSummary = article.summary.length > 100 
				? article.summary.slice(0, 100) + '...'
				: article.summary;
			  
			  return (
			  <ArticleCard
				key={article.id}
				title={article.title}
				  description={truncatedSummary}
				author={article.author}
				onClick={() => onArticleClick(article.id)}
			  />
			  );
			})}
		  </div>
		</main>
	  </div>
	);
}

export function QRLandingPage() {
	const navigate = useNavigate();

	const handleArticleClick = (id: number) => {
		navigate(`/a/article/${id}`);
	};

	return <ArticleList onArticleClick={handleArticleClick} />;
}
