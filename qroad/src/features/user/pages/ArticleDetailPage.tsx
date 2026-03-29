import { useState } from "react";
import { 
  ArrowLeft, Sparkles, Check, Building, User, ImageOff,
  Landmark, Home, Coins, ThumbsUp, Heart, Frown, Angry, MessageSquareWarning 
} from "lucide-react";
import { ArticleDetailResponse, EmotionType } from '@/types/admin';
import { userApi } from '@/api/user';
import { toRenderableImageUrl } from '@/shared/utils/image';

interface ArticleDetailProps {
	article: ArticleDetailResponse;
	onBack: () => void;
}

type EmotionState = Record<EmotionType, { isActive: boolean; count: number }>;

export function ArticleDetail({ article, onBack }: ArticleDetailProps) {
	const [emotions, setEmotions] = useState<EmotionState>({
		LIKE: { isActive: false, count: 0 },
		HEARTWARMING: { isActive: false, count: 0 },
		SAD: { isActive: false, count: 0 },
		ANGRY: { isActive: false, count: 0 },
		WANT_FOLLOW_UP: { isActive: false, count: 0 },
	});

	const handleEmotionToggle = async (type: EmotionType) => {
		try {
			const res = await userApi.toggleEmotion(article.articleId, { emotionType: type });
			setEmotions(prev => ({
				...prev,
				[type]: { isActive: res.isActive, count: res.totalCount }
			}));
		} catch (error) {
			console.error("Failed to toggle emotion:", error);
			alert("감정 표현을 반영하지 못했습니다.");
		}
	};

	const emotionButtons = [
		{ type: 'LIKE' as EmotionType, label: '좋아요', Icon: ThumbsUp, color: 'text-[#A16207]', bg: 'bg-[#FEFCE8]', border: 'border-[#FEF08A]', activeBg: 'bg-[#FEF08A]' },
		{ type: 'HEARTWARMING' as EmotionType, label: '훈훈해요', Icon: Heart, color: 'text-[#BE185D]', bg: 'bg-[#FDF2F8]', border: 'border-[#FBCFE8]', activeBg: 'bg-[#FBCFE8]' },
		{ type: 'SAD' as EmotionType, label: '슬퍼요', Icon: Frown, color: 'text-[#1D4ED8]', bg: 'bg-[#EFF6FF]', border: 'border-[#BFDBFE]', activeBg: 'bg-[#BFDBFE]' },
		{ type: 'ANGRY' as EmotionType, label: '화나요', Icon: Angry, color: 'text-[#B91C1C]', bg: 'bg-[#FEF2F2]', border: 'border-[#FECACA]', activeBg: 'bg-[#FECACA]' },
		{ type: 'WANT_FOLLOW_UP' as EmotionType, label: '후속기사 원해요', Icon: MessageSquareWarning, color: 'text-[#15803D]', bg: 'bg-[#F0FDF4]', border: 'border-[#BBF7D0]', activeBg: 'bg-[#BBF7D0]' },
	];

	return (
		<div className="w-full min-h-screen bg-[#F9FAFB] flex flex-col items-center">
			<div className="w-full max-w-[375px] bg-white relative min-h-screen pb-[100px] shadow-sm overflow-x-hidden">
				
				{/* Header */}
				<header className="w-full h-[64px] bg-white border-b border-[#E5E7EB] flex items-center justify-between px-4 sticky top-0 z-50">
					<button onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2">
						<ArrowLeft className="w-6 h-6 text-[#374151]" />
					</button>
					<div className="w-10 h-10" />
				</header>

				<main className="w-full">
					{/* Intro Section */}
					<section className="w-full px-4 pt-5 pb-8">
						<div className="flex items-center gap-2 mb-3">
							<span className="text-[12px] font-normal text-[#2563EB] tracking-[-0.5px]">지역소식</span>
							<span className="text-[12px] font-normal text-[#9CA3AF] tracking-[-0.5px]">5분 전</span>
						</div>
						
						<h1 className="text-[24px] font-normal text-[#111827] leading-[30px] tracking-[-0.5px] mb-5">
							{article.title || "서울시, 2024년 청년 주거 지원 정책 대폭 확대"}
						</h1>
						
						<div className="flex items-center gap-4">
							<div className="flex items-center gap-1.5">
								<Building className="w-3.5 h-3.5 text-[#6B7280]" />
								<span className="text-[14px] font-normal text-[#6B7280] tracking-[-0.5px]">{article.pressCompany || "서울일보"}</span>
							</div>
							<div className="flex items-center gap-1.5">
								<User className="w-3.5 h-3.5 text-[#6B7280]" />
								<span className="text-[14px] font-normal text-[#6B7280] tracking-[-0.5px]">{article.reporter || "김기자"}</span>
							</div>
						</div>
					</section>

					{/* AI Summary Section */}
					<section className="w-full px-4 pb-10">
						<div className="w-full p-5 bg-gradient-to-br from-[#EFF6FF] to-[#EEF2FF] border border-[#DBEAFE] rounded-[16px]">
							<div className="flex items-center gap-2 mb-4">
								<div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center">
									<Sparkles className="w-4 h-4 text-white" />
								</div>
								<span className="text-[14px] font-normal text-[#111827] tracking-[-0.5px]">AI 요약</span>
							</div>
							
							<p className="text-[16px] font-normal text-[#1F2937] leading-[26px] tracking-[-0.5px] mb-6 whitespace-pre-line">
								{article.summary || "서울시가 청년층의 주거 안정을 위해 월세 지원금을 기존 20만원에서 30만원으로 인상하고, 지원 대상도 3만 명에서 5만 명으로 확대합니다."}
							</p>
							
							{/* Key Points - If no structured AI points, mock them based on user provided data */}
							<div className="hidden">
								<h3 className="text-[14px] font-normal text-[#111827] tracking-[-0.5px] mb-1">핵심 내용</h3>
								<div className="flex items-start gap-2">
									<Check className="w-3 h-3 text-[#2563EB] mt-1 shrink-0" strokeWidth={3} />
									<span className="text-[14px] font-normal text-[#374151] leading-[20px] tracking-[-0.5px]">월세 지원금 20만원 → 30만원 인상</span>
								</div>
								<div className="flex items-start gap-2">
									<Check className="w-3 h-3 text-[#2563EB] mt-1 shrink-0" strokeWidth={3} />
									<span className="text-[14px] font-normal text-[#374151] leading-[20px] tracking-[-0.5px]">지원 대상 3만명 → 5만명 확대</span>
								</div>
								<div className="flex items-start gap-2">
									<Check className="w-3 h-3 text-[#2563EB] mt-1 shrink-0" strokeWidth={3} />
									<span className="text-[14px] font-normal text-[#374151] leading-[20px] tracking-[-0.5px]">만 19-39세 청년 신청 가능</span>
								</div>
								<div className="flex items-start gap-2">
									<Check className="w-3 h-3 text-[#2563EB] mt-1 shrink-0" strokeWidth={3} />
									<span className="text-[14px] font-normal text-[#374151] leading-[20px] tracking-[-0.5px]">3월 1일부터 온라인 신청 접수</span>
								</div>
							</div>
						</div>
					</section>

					{/* Related Policies */}
					{(article.policyArticleRelatedDTOS && article.policyArticleRelatedDTOS.length > 0) ? (
						<section className="w-full px-4 pb-10">
							<h2 className="text-[18px] font-normal text-[#111827] leading-[28px] tracking-[-0.5px] mb-3">
								관련 정책
							</h2>
							<div className="flex flex-col gap-3">
								{article.policyArticleRelatedDTOS.map((policy, index) => {
									const styles = [
										{ bg: 'bg-[#EFF6FF]', border: 'border-[#E5E7EB]', iconBg: 'bg-[#EFF6FF]', iconColor: 'text-[#2563EB]', statusText: 'text-[#15803D]', status: '신청가능', agency: '서울시', Icon: Landmark },
										{ bg: 'bg-white', border: 'border-[#E5E7EB]', iconBg: 'bg-[#FAF5FF]', iconColor: 'text-[#9333EA]', statusText: 'text-[#1D4ED8]', status: '진행중', agency: 'LH공사', Icon: Home },
										{ bg: 'bg-white', border: 'border-[#E5E7EB]', iconBg: 'bg-[#FFF7ED]', iconColor: 'text-[#EA580C]', statusText: 'text-[#15803D]', status: '신청가능', agency: '주택도시기금', Icon: Coins },
									];
									const s = styles[index % 3];
									
									return (
										<div key={policy.id} onClick={() => window.open(policy.link, '_blank')} className={`w-full p-4 ${s.bg} border ${s.border} rounded-[12px] flex items-start gap-4 cursor-pointer active:scale-[0.98] transition-transform`}>
											<div className={`w-12 h-12 rounded-lg ${s.iconBg} flex items-center justify-center shrink-0`}>
												<s.Icon className={`w-5 h-5 ${s.iconColor}`} />
											</div>
											<div className="flex flex-col justify-center flex-1">
												<h3 className="text-[14px] font-normal text-[#111827] leading-[20px] tracking-[-0.5px] mb-1 line-clamp-1">{policy.title}</h3>
												<p className="text-[12px] font-normal text-[#4B5563] leading-[16px] tracking-[-0.5px] mb-2 line-clamp-1">{policy.content}</p>
												<div className="flex items-center gap-2">
													<span className={`text-[12px] font-normal ${s.statusText} tracking-[-0.5px]`}>{s.status}</span>
													<span className="text-[12px] font-normal text-[#9CA3AF] tracking-[-0.5px]">{s.agency}</span>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</section>
					) : (
						/* Mock Policies Section */
						<section className="w-full px-4 pb-10">
							<h2 className="text-[18px] font-normal text-[#111827] leading-[28px] tracking-[-0.5px] mb-3">
								관련 정책
							</h2>
							<div className="flex flex-col gap-3">
								<div className="w-full p-4 bg-white border border-[#E5E7EB] rounded-[12px] flex items-start gap-4 cursor-pointer active:scale-[0.98] transition-transform">
									<div className="w-12 h-12 rounded-lg bg-[#EFF6FF] flex items-center justify-center shrink-0">
										<Landmark className="w-5 h-5 text-[#2563EB]" />
									</div>
									<div className="flex flex-col justify-center flex-1">
										<h3 className="text-[14px] font-normal text-[#111827] leading-[20px] tracking-[-0.5px] mb-1 line-clamp-1">청년 월세 지원 사업</h3>
										<p className="text-[12px] font-normal text-[#4B5563] leading-[16px] tracking-[-0.5px] mb-2 line-clamp-1">만 19-39세 청년에게 월 최대 30만원 지원</p>
										<div className="flex items-center gap-2">
											<span className="text-[12px] font-normal text-[#15803D] tracking-[-0.5px]">신청가능</span>
											<span className="text-[12px] font-normal text-[#9CA3AF] tracking-[-0.5px]">서울시</span>
										</div>
									</div>
								</div>
								
								<div className="w-full p-4 bg-white border border-[#E5E7EB] rounded-[12px] flex items-start gap-4 cursor-pointer active:scale-[0.98] transition-transform">
									<div className="w-12 h-12 rounded-lg bg-[#FAF5FF] flex items-center justify-center shrink-0">
										<Home className="w-5 h-5 text-[#9333EA]" />
									</div>
									<div className="flex flex-col justify-center flex-1">
										<h3 className="text-[14px] font-normal text-[#111827] leading-[20px] tracking-[-0.5px] mb-1 line-clamp-1">청년 임대주택 공급</h3>
										<p className="text-[12px] font-normal text-[#4B5563] leading-[16px] tracking-[-0.5px] mb-2 line-clamp-1">시세 80% 이하 청년 전용 임대주택 공급</p>
										<div className="flex items-center gap-2">
											<span className="text-[12px] font-normal text-[#1D4ED8] tracking-[-0.5px]">진행중</span>
											<span className="text-[12px] font-normal text-[#9CA3AF] tracking-[-0.5px]">LH공사</span>
										</div>
									</div>
								</div>

								<div className="w-full p-4 bg-white border border-[#E5E7EB] rounded-[12px] flex items-start gap-4 cursor-pointer active:scale-[0.98] transition-transform">
									<div className="w-12 h-12 rounded-lg bg-[#FFF7ED] flex items-center justify-center shrink-0">
										<Coins className="w-5 h-5 text-[#EA580C]" />
									</div>
									<div className="flex flex-col justify-center flex-1">
										<h3 className="text-[14px] font-normal text-[#111827] leading-[20px] tracking-[-0.5px] mb-1 line-clamp-1">청년 전월세 보증금 대출</h3>
										<p className="text-[12px] font-normal text-[#4B5563] leading-[16px] tracking-[-0.5px] mb-2 line-clamp-1">최대 1억원, 연 1.5% 저금리 대출 지원</p>
										<div className="flex items-center gap-2">
											<span className="text-[12px] font-normal text-[#15803D] tracking-[-0.5px]">신청가능</span>
											<span className="text-[12px] font-normal text-[#9CA3AF] tracking-[-0.5px]">주택도시기금</span>
										</div>
									</div>
								</div>
							</div>
						</section>
					)}

					{/* Related Articles */}
					{(article.articleRelatedDTOS && article.articleRelatedDTOS.length > 0) ? (
						<section className="w-full px-4 pb-12">
							<h2 className="text-[18px] font-normal text-[#111827] leading-[28px] tracking-[-0.5px] mb-3">
								관련 기사
							</h2>
							<div className="flex flex-col gap-3">
								{article.articleRelatedDTOS.map((related) => (
									<div key={related.id} onClick={() => window.open(related.link, '_blank')} className="w-full p-[13px] bg-white border border-[#E5E7EB] rounded-[12px] flex gap-[12px] cursor-pointer active:scale-[0.98] transition-transform">
										{toRenderableImageUrl(related.imagePath) ? (
											<img
												src={toRenderableImageUrl(related.imagePath)!}
												alt={related.title}
												className="w-[80px] h-[80px] rounded-[8px] object-cover shrink-0"
												loading="lazy"
											/>
										) : (
											<div className="w-[80px] h-[80px] rounded-[8px] bg-[#F3F4F6] shrink-0 overflow-hidden flex flex-col items-center justify-center text-[#9CA3AF]">
												<ImageOff className="w-4 h-4 mb-1" />
												<span className="text-[10px] tracking-[-0.5px]">이미지 없음</span>
											</div>
										)}
										<div className="flex flex-col justify-center flex-1">
											<h3 className="text-[14px] font-normal text-[#111827] leading-[20px] tracking-[-0.5px] mb-1 line-clamp-2">
												{related.title}
											</h3>
											<p className="text-[12px] font-normal text-[#6B7280] leading-[16px] tracking-[-0.5px] mb-2 line-clamp-1">
												{related.content}
											</p>
											<div className="flex items-center gap-1.5 text-[12px] font-normal text-[#9CA3AF] tracking-[-0.5px]">
												<span>경제일보</span>
												<span>•</span>
												<span>1시간 전</span>
											</div>
										</div>
									</div>
								))}
							</div>
						</section>
					) : (
						/* Mock Articles Section */
						<section className="w-full px-4 pb-12">
							<h2 className="text-[18px] font-normal text-[#111827] leading-[28px] tracking-[-0.5px] mb-3">
								관련 기사
							</h2>
							<div className="flex flex-col gap-3">
								{[
									{ title: "청년층 주거비 부담, 소득의 40% 육박", desc: "통계청 발표 청년 가구 평균 주거비 분석", pub: "경제일보", time: "1시간 전" },
									{ title: "지방 청년 주거 지원도 확대 추진", desc: "국토부, 전국 광역시 대상 정책 확산", pub: "서울일보", time: "3시간 전" },
									{ title: "서울시 \"청년 정책 예산 전년比 25% 증액\"", desc: "2024년 청년 지원 예산 8천억원 편성", pub: "한국일보", time: "5시간 전" }
								].map((mock, idx) => (
									<div key={idx} className="w-full p-[13px] bg-white border border-[#E5E7EB] rounded-[12px] flex gap-[12px] cursor-pointer active:scale-[0.98] transition-transform">
										<div className="w-[80px] h-[80px] rounded-[8px] bg-[#E5E7EB] shrink-0 overflow-hidden relative" />
										<div className="flex flex-col justify-center flex-1">
											<h3 className="text-[14px] font-normal text-[#111827] leading-[20px] tracking-[-0.5px] mb-1 line-clamp-2">
												{mock.title}
											</h3>
											<p className="text-[12px] font-normal text-[#6B7280] leading-[16px] tracking-[-0.5px] mb-2 line-clamp-1">
												{mock.desc}
											</p>
											<div className="flex items-center gap-1.5 text-[12px] font-normal text-[#9CA3AF] tracking-[-0.5px]">
												<span>{mock.pub}</span>
												<span>•</span>
												<span>{mock.time}</span>
											</div>
										</div>
									</div>
								))}
							</div>
						</section>
					)}
				</main>

				{/* Fixed Footer Reactions */}
				<div className="fixed bottom-0 left-0 right-0 w-full bg-white border-t border-[#E5E7EB] z-40">
					<div className="w-full max-w-[375px] mx-auto h-[79px] px-4 flex items-center overflow-x-auto gap-2 no-scrollbar">
						{emotionButtons.map(({ type, label, Icon, color, bg, border, activeBg }) => {
							const state = emotions[type];
							return (
								<button 
									key={type}
									onClick={() => handleEmotionToggle(type)}
									className={`h-[46px] px-4 shrink-0 ${state.isActive ? activeBg : bg} border ${border} rounded-[12px] flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all`}
								>
									<Icon className={`w-[14px] h-[14px] ${color}`} />
									<span className={`text-[14px] font-normal ${color} tracking-[-0.5px]`}>
										{label} {state.count > 0 && ` ${state.count}`}
									</span>
								</button>
							);
						})}
					</div>
					
					{/* Add custom util class for hiding scrollbar if not exists globally */}
					<style>{`
						.no-scrollbar::-webkit-scrollbar {
							display: none;
						}
						.no-scrollbar {
							-ms-overflow-style: none;  /* IE and Edge */
							scrollbar-width: none;  /* Firefox */
						}
					`}</style>
				</div>
			</div>
		</div>
	);
}
