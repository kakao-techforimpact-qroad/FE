import { Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserLandingPage } from '@/hooks/user/useLandingPage';

interface ArticleListProps {
  onArticleClick: (id: number) => void;
  articles: Array<{ id: number; title: string }>;
  isLoading?: boolean;
  publishedDate?: string;
}

export function ArticleList({ onArticleClick, articles, isLoading, publishedDate }: ArticleListProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-[#2563EB] animate-spin mx-auto mb-4" />
          <p className="text-[#4B5563] text-[14px]">기사를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const mainArticle = articles[0] ?? null;
  const subArticles = articles.slice(1);
  const publishedDateLabel = publishedDate || '-';

  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] flex flex-col items-center">
      <div className="w-full max-w-[375px] bg-[#F9FAFB] relative min-h-screen pb-[120px] shadow-sm">
        <header className="w-full h-[57px] bg-white border-b border-[#E5E7EB] flex items-center justify-between px-4 sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <img src="/qr.svg" alt="QRoad Logo" className="w-[16px] h-[16px]" />
            <span className="text-[20px] font-bold text-[#111827] tracking-[-0.5px]">QRoad</span>
          </div>
          <a
            href="https://curly-marjoram-9d4.notion.site/2bbe6f94cb6d806281d6cfe611061601"
            target="_blank"
            rel="noreferrer"
            className="bg-[#F3F4F6] rounded-full px-3 py-[6px] flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <span className="text-[12px] text-[#374151] tracking-[-0.5px]">신문 구독방법</span>
          </a>
        </header>

        <div className="w-full px-4 py-[16px] bg-gradient-to-r from-[#EFF6FF] to-[#EEF2FF] border-b border-[#DBEAFE] flex flex-col justify-center">
          <div className="flex flex-col gap-[2px] mb-[20px]">
            <h2 className="text-[16px] font-normal text-[#111827] tracking-[-0.5px]">오늘의 주간 소식</h2>
            <p className="text-[12px] font-normal text-[#4B5563] tracking-[-0.5px]">발행일: {publishedDateLabel}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <img src="/robot.svg" alt="AI News" className="w-3.5 h-3.5" />
            <span className="text-[14px] font-normal text-[#374151] tracking-[-0.5px]">AI가 선별한 오늘의 핵심 뉴스</span>
          </div>
        </div>

        <main className="w-full px-4 pt-4">
          <div className="mb-10">
            <div className="flex items-center gap-1.5 mb-3">
              <img src="/star.svg" alt="Hot News" className="w-[18px] h-[18px]" />
              <h3 className="text-[18px] font-normal text-[#111827] tracking-[-0.5px]">이번 주 주요 뉴스</h3>
            </div>

            {mainArticle ? (
              <div
                onClick={() => onArticleClick(mainArticle.id)}
                className="w-full bg-white border border-[#E5E7EB] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] rounded-[12px] overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="w-full aspect-[341/192] bg-[#F3F4F6] relative" />
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[12px] font-normal text-[#B91C1C] tracking-[-0.5px]">주요뉴스</span>
                    <span className="text-[12px] font-normal text-[#6B7280] tracking-[-0.5px]">{publishedDateLabel}</span>
                  </div>
                  <h4 className="text-[16px] font-normal text-[#111827] leading-[24px] tracking-[-0.5px] line-clamp-2">
                    {mainArticle.title}
                  </h4>
                </div>
              </div>
            ) : (
              <div className="w-full p-4 bg-white border border-[#E5E7EB] rounded-[12px] text-[14px] text-[#6B7280]">
                기사 데이터가 없습니다.
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <img src="/list.svg" alt="Article List" className="w-4 h-4" />
              <h3 className="text-[16px] font-normal text-[#111827] tracking-[-0.5px]">이번 주 기사</h3>
            </div>

            <div className="flex flex-col gap-3">
              {subArticles.length > 0 ? (
                subArticles.map((article) => (
                  <div
                    key={article.id}
                    onClick={() => onArticleClick(article.id)}
                    className="w-full h-[106px] bg-white border border-[#E5E7EB] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] rounded-[12px] p-[13px] flex gap-[12px] cursor-pointer active:scale-[0.98] transition-transform"
                  >
                    <div className="w-[80px] h-[80px] rounded-[8px] bg-[#F3F4F6] shrink-0 overflow-hidden relative" />
                    <div className="flex flex-col flex-1 justify-center">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[12px] font-normal text-[#2563EB] tracking-[-0.5px]">뉴스</span>
                        <span className="text-[12px] font-normal text-[#6B7280] tracking-[-0.5px]">{publishedDateLabel}</span>
                      </div>
                      <h4 className="text-[14px] font-normal text-[#111827] leading-[20px] tracking-[-0.5px] line-clamp-2">
                        {article.title}
                      </h4>
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full p-4 bg-white border border-[#E5E7EB] rounded-[12px] text-[14px] text-[#6B7280]">
                  추가 기사 데이터가 없습니다.
                </div>
              )}
            </div>
          </div>
        </main>

        <div className="fixed bottom-0 left-0 right-0 w-full bg-white flex flex-col items-center justify-center pt-3 pb-8 z-40 border-t border-[#E5E7EB]">
          <div className="w-full max-w-[375px] px-4 flex flex-col gap-[10px]">
            <button
              onClick={() => navigate('/report')}
              className="w-full h-[52px] bg-gradient-to-r from-[#2563EB] to-[#4F46E5] shadow-[0px_4px_6px_rgba(0,0,0,0.1),0px_10px_15px_rgba(0,0,0,0.1)] rounded-[12px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              <img src="/white_docu.svg" alt="Report" className="w-4 h-4 brightness-0 invert" />
              <span className="text-[16px] font-normal text-white text-center tracking-[-0.5px]">민원 및 제보</span>
            </button>
            <p className="text-[12px] font-normal text-[#6B7280] text-center tracking-[-0.5px]">지역 소식을 편리하게 만나보세요.</p>
          </div>
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

  if (error) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-[375px] bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB] text-center">
          <p className="text-[#111827] font-medium mb-2">기사를 불러올 수 없습니다.</p>
          <p className="text-[14px] text-[#B91C1C]">{String(error)}</p>
        </div>
      </div>
    );
  }

  const articles = (data?.articleSimpleDTOS || []).map((article) => ({
    id: article.id,
    title: article.title,
  }));

  return (
    <ArticleList
      onArticleClick={handleArticleClick}
      articles={articles}
      isLoading={isLoading}
      publishedDate={data?.publishedDate}
    />
  );
}
