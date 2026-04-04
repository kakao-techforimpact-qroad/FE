import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { ChevronLeft, ChevronRight, Loader2, ArrowLeft, FileText, Copy, Printer, Info } from 'lucide-react';
import { usePublication, useUpdateArticle } from '@/hooks/admin/usePublications';
import { toast } from 'sonner';
import { QRCodeGenerator } from '@/shared/components/QRCodeGenerator';
import { ArticleInResponse } from '@/types/admin';

const ArticleCard = ({
    article,
    index,
    onUpdate
}: {
    article: ArticleInResponse;
    index: number;
    onUpdate: (articleId: number, data: { summary: string; keywords: string[] }) => void;
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [summary, setSummary] = useState(article.summary);
    const [keywords, setKeywords] = useState(article.keywords.join(', '));

    const handleSave = () => {
        const keywordArray = keywords.split(',').map(k => k.trim()).filter(k => k);
        onUpdate(article.id, { summary, keywords: keywordArray });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setSummary(article.summary);
        setKeywords(article.keywords.join(', '));
        setIsEditing(false);
    };

    return (
        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] flex flex-col h-full font-['Inter']">
            {/* Header */}
            <div className="h-[57px] border-b border-[#F3F4F6] flex items-center px-[16px]">
                <span className="font-medium text-[14px] leading-[20px] tracking-[-0.5px] text-[#111827]">
                    AI 분석 결과 #{index + 1}
                </span>
            </div>
            
            {/* Body */}
            <div className="p-[16px] flex flex-col gap-[12px] flex-1">
                {/* Title */}
                <div className="flex flex-col gap-[4px]">
                    <span className="font-medium text-[12px] leading-[15px] tracking-[-0.5px] text-[#374151]">
                        제목
                    </span>
                    <span className="font-normal text-[14px] leading-[17px] tracking-[-0.5px] text-[#111827]">
                        {article.title}
                    </span>
                </div>

                {/* Summary (Added based on user instruction) */}
                <div className="flex flex-col gap-[4px]">
                    <span className="font-medium text-[12px] leading-[15px] tracking-[-0.5px] text-[#374151]">
                        AI 요약
                    </span>
                    {isEditing ? (
                        <Textarea
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            rows={4}
                            className="bg-[#FFFFFF] border border-[#D1D5DB] focus:border-[#2563EB] rounded-[6px] text-[14px] p-2 resize-none"
                        />
                    ) : (
                        <span className="font-normal text-[14px] leading-[17px] tracking-[-0.5px] text-[#111827]">
                            {article.summary}
                        </span>
                    )}
                </div>

                {/* Keywords */}
                <div className="flex flex-col gap-[4px]">
                    <span className="font-medium text-[12px] leading-[15px] tracking-[-0.5px] text-[#374151]">
                        키워드
                    </span>
                    {isEditing ? (
                        <>
                            <Input
                                value={keywords}
                                onChange={(e) => setKeywords(e.target.value)}
                                className="bg-[#FFFFFF] border border-[#D1D5DB] focus:border-[#2563EB] h-[36px] rounded-[6px] text-[14px]"
                                placeholder="키워드1, 키워드2"
                            />
                            <p className="text-[11px] text-[#6B7280]">쉼표(,)로 구분</p>
                        </>
                    ) : (
                        <div className="flex flex-wrap gap-[12px] mt-[4px]">
                            {article.keywords.map((k, idx) => (
                                <span key={idx} className="font-normal text-[12px] leading-[16px] tracking-[-0.5px] text-[#1E40AF]">
                                    {k}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer / Button */}
            <div className="px-[16px] pb-[16px] mt-auto">
                {isEditing ? (
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            className="flex-1 h-[36px] bg-[#2563EB] hover:bg-[#1D4ED8] rounded-[6px] font-medium text-[14px] leading-[17px] tracking-[-0.5px] text-center text-[#FFFFFF] transition-colors"
                        >
                            저장하기
                        </button>
                        <button
                            onClick={handleCancel}
                            className="flex-1 h-[36px] bg-[#FFFFFF] border border-[#D1D5DB] hover:bg-[#F9FAFB] rounded-[6px] font-medium text-[14px] leading-[17px] tracking-[-0.5px] text-center text-[#374151] transition-colors"
                        >
                            취소
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="w-full h-[36px] bg-[#2563EB] hover:bg-[#1D4ED8] rounded-[6px] font-medium text-[14px] leading-[17px] tracking-[-0.5px] text-center text-[#FFFFFF] transition-colors"
                    >
                        수정하기
                    </button>
                )}
            </div>
        </div>
    );
};

export const IssueEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: publication, isLoading, error } = usePublication(Number(id));
    const updateArticleMutation = useUpdateArticle(Number(id));
    const [qrStatus, setQrStatus] = useState(false);
    const qrCodeRef = useRef<{ download: (fileName?: string) => void }>(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 8;

    const handleGenerateQR = () => {
        setQrStatus(true);
        toast.success('✨ QR 코드가 생성되었습니다! 기사가 발행되었습니다.');
    };

    const handleCopyUrl = () => {
        if (!publication) return;
        navigator.clipboard.writeText(`${window.location.origin}/a/${publication.paper_id}`);
        toast.success('URL이 클립보드에 복사되었습니다');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <Loader2 className="w-10 h-10 text-[#2563EB] animate-spin" />
            </div>
        );
    }

    if (error || !publication) {
        return (
            <div className="flex flex-col items-center justify-center p-20 gap-4 w-full text-center">
                <FileText className="w-10 h-10 text-[#EF4444]" />
                <h3 className="text-xl font-semibold text-[#111827]">기사를 찾을 수 없습니다</h3>
                <Button onClick={() => navigate('/admin/issues')} className="bg-[#2563EB] hover:bg-[#1D4ED8]">
                    <ArrowLeft className="w-4 h-4 mr-2" /> 기사 이력으로 돌아가기
                </Button>
            </div>
        );
    }

    const handleArticleUpdate = (articleId: number, data: { summary: string; keywords: string[] }) => {
        updateArticleMutation.mutate({ articleId, data });
    };

    // Calculate Pagination
    const totalPages = publication ? Math.ceil(publication.articles.length / articlesPerPage) : 0;
    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const currentArticles = publication ? publication.articles.slice(startIndex, endIndex) : [];

    return (
        <div className="w-full min-h-full bg-[#F9FAFB] font-['Inter'] flex flex-col relative pb-10">
            {/* Top Back Navigation (Not explicit in Figma but necessary) */}
            <div className="absolute top-[20px] left-[32px] flex items-center gap-[4px] cursor-pointer" onClick={() => navigate('/admin/issues')}>
                <ChevronLeft className="w-4 h-4 text-[#4B5563]" />
                <span className="font-normal text-[14px] text-[#4B5563] tracking-[-0.5px]">이전</span>
            </div>

            {/* Title Area */}
            <div className="w-full h-[109px] bg-[#FFFFFF] border-b border-[#E5E7EB] pt-[24px] px-[32px] mt-[65px]">
                <h1 className="font-semibold text-[24px] leading-[32px] tracking-[-0.5px] text-[#111827]">
                    기사 상세 관리
                </h1>
                <p className="mt-[9px] font-normal text-[14px] leading-[20px] tracking-[-0.5px] text-[#4B5563]">
                    AI 분석 결과를 검토하고 수정할 수 있습니다.
                </p>
            </div>

            {/* Tabs & Content Container */}
            <Tabs defaultValue="ai" className="w-full flex flex-col">
                <div className="w-full h-[55px] bg-[#FFFFFF] border-b border-[#E5E7EB]">
                    <TabsList className="flex h-full bg-transparent p-0 rounded-none w-max px-[32px] gap-[24px]">
                        <TabsTrigger
                            value="info"
                            className="h-[54px] rounded-none border-b-2 border-transparent data-[state=active]:border-[#2563EB] px-[8px] font-medium text-[14px] leading-[17px] tracking-[-0.5px] disabled:opacity-50 text-[#6B7280] data-[state=active]:text-[#2563EB] data-[state=active]:shadow-none bg-transparent"
                        >
                            기사 정보
                        </TabsTrigger>
                        <TabsTrigger
                            value="ai"
                            className="h-[54px] rounded-none border-b-2 border-transparent data-[state=active]:border-[#2563EB] px-[8px] font-medium text-[14px] leading-[17px] tracking-[-0.5px] disabled:opacity-50 text-[#6B7280] data-[state=active]:text-[#2563EB] data-[state=active]:shadow-none bg-transparent"
                        >
                            AI 분석
                        </TabsTrigger>
                        <TabsTrigger
                            value="qr"
                            className="h-[54px] rounded-none border-b-2 border-transparent data-[state=active]:border-[#2563EB] px-[8px] font-medium text-[14px] leading-[17px] tracking-[-0.5px] disabled:opacity-50 text-[#6B7280] data-[state=active]:text-[#2563EB] data-[state=active]:shadow-none bg-transparent"
                        >
                            QR 코드
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="px-[32px] pt-[32px]">
                    
                    {/* INFO TAB */}
                    <TabsContent value="info" className="mt-0 outline-none">
                        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] p-6 shadow-sm max-w-4xl space-y-4">
                            <h2 className="text-xl font-semibold mb-4 text-[#111827]">기본 정보</h2>
                            <div>
                                <span className="block text-sm font-medium text-[#6B7280]">제목</span>
                                <span className="text-base text-[#111827]">{publication.title}</span>
                            </div>
                            <div>
                                <span className="block text-sm font-medium text-[#6B7280]">발행일</span>
                                <span className="text-base text-[#111827]">{publication.published_date}</span>
                            </div>
                            <div>
                                <span className="block text-sm font-medium text-[#6B7280]">URL</span>
                                <span className="text-base text-[#2563EB]">{`${window.location.origin}/a/${publication.paper_id}`}</span>
                            </div>
                            <div className="mt-4">
                                <span className="block text-sm font-medium text-[#6B7280] mb-2">원문 텍스트</span>
                                <Textarea className="w-full bg-[#F9FAFB] border-[#D1D5DB]" value={publication.body} readOnly rows={12} />
                            </div>
                        </div>
                    </TabsContent>

                    {/* AI ANALYSIS TAB */}
                    <TabsContent value="ai" className="mt-0 outline-none">
                        <div className="flex flex-col mb-[24px]">
                            <h2 className="font-medium text-[18px] leading-[28px] tracking-[-0.5px] text-[#111827]">
                                AI가 생성한 Article 목록
                            </h2>
                            <p className="font-normal text-[14px] leading-[20px] tracking-[-0.5px] text-[#4B5563]">
                                총 {publication.article_count}개의 분석 결과
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[24px] max-w-full">
                            {currentArticles.map((article: ArticleInResponse, localIdx: number) => (
                                <ArticleCard
                                    key={article.id}
                                    index={startIndex + localIdx}
                                    article={article}
                                    onUpdate={handleArticleUpdate}
                                />
                            ))}
                        </div>

                        {/* Pagination Component */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-[40px]">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="w-[34.75px] h-[38px] bg-[#FFFFFF] border border-[#D1D5DB] rounded-[8px] flex items-center justify-center disabled:opacity-50 transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4 text-[#6B7280]" />
                                </button>

                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`min-w-[31.81px] h-[38px] px-[12px] border rounded-[8px] font-medium text-[14px] leading-[17px] tracking-[-0.5px] text-center transition-colors ${
                                            currentPage === i + 1 
                                                ? 'bg-[#2563EB] border-[#2563EB] text-[#FFFFFF]' 
                                                : 'bg-[#FFFFFF] border-[#D1D5DB] text-[#374151] hover:bg-[#F9FAFB]'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-[34.75px] h-[38px] bg-[#FFFFFF] border border-[#D1D5DB] rounded-[8px] flex items-center justify-center disabled:opacity-50 transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4 text-[#374151]" />
                                </button>
                            </div>
                        )}
                        
                        {publication.articles.length === 0 && (
                            <div className="text-center py-20 bg-white border border-[#E5E7EB] rounded-lg">
                                <FileText className="w-10 h-10 text-[#9CA3AF] mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-[#111827] mb-1">분석된 기사가 없습니다</h3>
                            </div>
                        )}
                    </TabsContent>

                    {/* QR CODE TAB */}
                    <TabsContent value="qr" className="mt-0 outline-none w-full flex justify-center bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] py-[33px]">
                        {!qrStatus ? (
                            <div className="flex flex-col items-center justify-center p-[60px] text-center max-w-[768px] mx-auto">
                                <h3 className="font-['Noto_Sans_KR'] font-normal text-[20px] leading-[28px] tracking-[-0.5px] text-[#111827]">QR 코드 관리</h3>
                                <p className="font-['Noto_Sans_KR'] font-normal text-[14px] leading-[20px] tracking-[-0.5px] text-[#6B7280] mt-[8px] mb-[24px]">이 기사에 해당하는 사용자 접근용 QR 코드를 생성합니다.</p>
                                <Button onClick={handleGenerateQR} className="bg-[#4A90E2] hover:bg-[#3B82F6] h-[58px] px-[80px] rounded-[8px] font-['Noto_Sans_KR'] font-normal text-[16px] text-[#FFFFFF]">
                                    QR 생성
                                </Button>
                            </div>
                        ) : (
                            <div className="w-[768px] flex flex-col items-center">
                                {/* Title Area */}
                                <div className="text-center w-full mb-[88px]">
                                    <h3 className="font-['Noto_Sans_KR'] font-normal text-[20px] leading-[28px] tracking-[-0.5px] text-[#111827]">QR 코드 관리</h3>
                                    <p className="font-['Noto_Sans_KR'] font-normal text-[14px] leading-[20px] tracking-[-0.5px] text-[#6B7280] mt-[8px]">생성된 QR 코드를 확인하고 다운로드할 수 있습니다</p>
                                </div>

                                {/* QR Image Box */}
                                <div className="w-[768px] h-[400px] bg-[#F9FAFB] rounded-[8px] flex flex-col items-center justify-center p-[32px] mb-[24px]">
                                    <div className="w-[304px] h-[304px] bg-[#FFFFFF] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] rounded-[8px] flex items-center justify-center border border-[#F3F4F6]">
                                        <div className="w-[256px] h-[256px] flex items-center justify-center">
                                            <QRCodeGenerator
                                                ref={qrCodeRef}
                                                url={`${window.location.origin}/a/${publication.paper_id}`}
                                                size={256}
                                            />
                                        </div>
                                    </div>
                                    <span className="font-['Noto_Sans_KR'] font-normal text-[12px] leading-[16px] tracking-[-0.5px] text-[#6B7280] mt-[16px]">
                                        QR 코드 크기: 512 x 512 픽셀
                                    </span>
                                </div>

                                {/* URL Box */}
                                <div className="w-[768px] flex flex-col gap-[8px] mb-[98px]">
                                    <label className="font-['Noto_Sans_KR'] font-normal text-[14px] leading-[17px] tracking-[-0.5px] text-[#374151]">기사 URL</label>
                                    <div className="flex w-full gap-[8px] h-[50px] relative">
                                        <input
                                            className="w-[676px] h-[50px] bg-[#F9FAFB] border border-[#D1D5DB] rounded-[8px] px-[16px] font-['Inter'] font-normal text-[14px] text-[#374151] outline-none"
                                            value={`${window.location.origin}/a/${publication.paper_id}`}
                                            readOnly
                                        />
                                        <button 
                                            onClick={handleCopyUrl} 
                                            className="w-[83.77px] h-[50px] bg-[#F3F4F6] border border-[#D1D5DB] rounded-[8px] flex items-center justify-center gap-[4px] cursor-pointer hover:bg-[#E5E7EB] transition-colors"
                                        >
                                            <Copy className="w-[16px] h-[16px] text-[#4B5563]" />
                                            <span className="font-['Noto_Sans_KR'] font-normal text-[14px] text-[#374151]">복사</span>
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-[4px] mt-[8px]">
                                        <Info className="w-[12px] h-[12px] text-[#9CA3AF]" />
                                        <span className="font-['Noto_Sans_KR'] font-normal text-[12px] leading-[14px] tracking-[-0.5px] text-[#6B7280]">
                                            이 URL은 QR 코드 스캔 시 연결되는 주소입니다
                                        </span>
                                    </div>
                                </div>

                                {/* Download / Print Buttons */}
                                <div className="w-[768px] flex gap-[12px] mb-[24px]">
                                    <button 
                                        onClick={() => {
                                            qrCodeRef.current?.download(`qroad-issue-${publication.paper_id}-qr`);
                                            toast.success('QR 코드를 다운로드했습니다');
                                        }} 
                                        className="flex-1 h-[58px] bg-[#4A90E2] hover:bg-[#3B82F6] rounded-[8px] flex items-center justify-center gap-[8px] transition-colors"
                                    >
                                        <ArrowLeft className="w-[16px] h-[16px] text-white rotate-[-90deg]" />
                                        <span className="font-['Noto_Sans_KR'] font-normal text-[16px] text-[#FFFFFF]">QR 코드 다운로드 (PNG)</span>
                                    </button>
                                    <button 
                                        onClick={() => toast.info('인쇄 기능이 준비 중입니다.')} 
                                        className="w-[103.45px] h-[58px] bg-[#FFFFFF] hover:bg-[#F9FAFB] border border-[#D1D5DB] rounded-[8px] flex items-center justify-center gap-[4px] transition-colors"
                                    >
                                        <Printer className="w-[16px] h-[16px] text-[#374151]" />
                                        <span className="font-['Noto_Sans_KR'] font-normal text-[16px] text-[#374151]">인쇄</span>
                                    </button>
                                </div>
                                <div className="w-full text-center">
                                    <span className="font-['Noto_Sans_KR'] font-normal text-[12px] leading-[16px] tracking-[-0.5px] text-[#6B7280]">
                                        PNG 형식으로 다운로드되며, 인쇄 시 고해상도로 출력됩니다
                                    </span>
                                </div>
                            </div>
                        )}
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
};
