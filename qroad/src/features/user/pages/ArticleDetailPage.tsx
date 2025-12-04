import { ArrowLeft, Sparkles, FileText, Scale, ExternalLinkIcon } from "lucide-react";
import { ArticleDetailResponse } from '@/types/admin';

interface ArticleDetailProps {
	article: ArticleDetailResponse;
	onBack: () => void;
}

export function ArticleDetail({ article, onBack }: ArticleDetailProps) {
	return (
		<div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
			{/* Modern Purple Header with Back Button */}
			<header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-purple-100 shadow-lg shadow-purple-500/5">
				<div className="max-w-md mx-auto px-6 py-6">
					<div className="flex items-center justify-between">
						{/* Back button */}
						<button
							onClick={onBack}
							className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border border-purple-200 hover:from-violet-100 hover:to-purple-100 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
						>
							<ArrowLeft className="w-5 h-5 text-violet-600 group-hover:-translate-x-1 transition-transform duration-300" />
							<span className="font-semibold text-foreground">Back</span>
						</button>

						{/* Logo with enhanced design */}
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
								<h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
									QRoad
								</h1>
								<div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-violet-600/0 via-purple-600/50 to-violet-600/0 rounded-full" />
							</div>
						</div>
					</div>
				</div>
			</header>

			{/* Article Content */}
			<main className="max-w-md mx-auto px-6 py-12">
				<div className="space-y-10">
					{/* Article Header */}
					<div className="space-y-5">
						<h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
							{article.title}
						</h1>
						<div className="flex items-center gap-4 text-muted-foreground">
							<span className="text-sm font-medium px-3 py-1.5 bg-purple-100 text-violet-700 rounded-full">
								{article.publishedDate}
							</span>
							<span className="text-sm font-medium">{article.pressCompany}</span>
							<span className="text-sm font-medium">{article.reporter}</span>
						</div>
					</div>

					{/* AI Summary Section - Purple Highlight */}
					<section className="relative bg-white p-8 rounded-2xl border-2 border-purple-200 shadow-xl shadow-purple-500/10 overflow-hidden">
						<div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-200/30 to-purple-200/30 rounded-full blur-3xl -translate-y-32 translate-x-32" />

						<div className="relative space-y-5">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
									<Sparkles className="w-5 h-5 text-white" />
								</div>
								<h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
									AI 요약
								</h2>
							</div>
							<p className="text-base text-foreground/90 leading-relaxed">
								{article.summary}
							</p>
						</div>
					</section>

					{/* Related Articles */}
					{article.articleRelatedDTOS && article.articleRelatedDTOS.length > 0 && (
						<section className="space-y-6">
							<div className="flex items-center gap-3">
								<FileText className="w-6 h-6 text-violet-600" />
								<h2 className="text-2xl font-bold text-foreground">
									연관 기사
								</h2>
							</div>
							<div className="grid grid-cols-1 gap-4">
								{article.articleRelatedDTOS.map((related) => (
									<div
										key={related.id}
										onClick={() => window.open(related.link, '_blank')}
										className="group relative bg-white p-6 rounded-xl border border-purple-100 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer overflow-hidden"
									>
										<div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
										<div className="relative space-y-2">
											<div className="flex items-start justify-between gap-3">
												<h3 className="font-semibold text-foreground leading-tight group-hover:text-violet-600 transition-colors duration-300">
													{related.title}
												</h3>
												<ExternalLinkIcon className="w-5 h-5 text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0" />
											</div>
											<p className="text-sm text-muted-foreground leading-relaxed">
												{related.content}
											</p>
										</div>
									</div>
								))}
							</div>
						</section>
					)}

					{/* Related Policies */}
					{article.policyArticleRelatedDTOS && article.policyArticleRelatedDTOS.length > 0 && (
						<section className="space-y-6 pb-12">
							<div className="flex items-center gap-3">
								<Scale className="w-6 h-6 text-violet-600" />
								<h2 className="text-2xl font-bold text-foreground">
									연관 정책
								</h2>
							</div>
							<div className="space-y-3">
								{article.policyArticleRelatedDTOS.map((policy) => (
									<div
										key={policy.id}
										onClick={() => window.open(policy.link, '_blank')}
										className="group relative bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-100 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/10 hover:from-white hover:to-white transition-all duration-300 cursor-pointer"
									>
										<div className="space-y-2">
											<div className="flex items-start justify-between gap-3">
												<h3 className="font-semibold text-foreground group-hover:text-violet-600 transition-colors duration-300">
													{policy.title}
												</h3>
												<ExternalLinkIcon className="w-5 h-5 text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0" />
											</div>
											<p className="text-sm text-muted-foreground leading-relaxed">
												{policy.content}
											</p>
										</div>
									</div>
								))}
							</div>
						</section>
					)}
				</div>
			</main>
		</div>
	);
}
