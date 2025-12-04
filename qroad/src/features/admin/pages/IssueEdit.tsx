import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { ArrowLeft, Download, QrCode, Save, Sparkles, FileText, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePublication, useUpdateArticle } from '@/hooks/admin/usePublications';
import { toast } from 'sonner';
import { QRCodeGenerator } from '@/shared/components/QRCodeGenerator';
import { ArticleInResponse } from '@/types/admin';

const ArticleCard = ({
    article,
    onUpdate
}: {
    article: ArticleInResponse;
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full"
        >
            <Card className="h-full border-purple-200 hover:shadow-xl transition-shadow overflow-hidden p-0">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-100 px-4 pt-4 pb-2">
                    <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">Article #{article.id}</div>
                        {!isEditing && (
                            <Button
                                onClick={() => setIsEditing(true)}
                                variant="outline"
                                size="sm"
                                className="border-purple-300 text-purple-600 hover:bg-purple-50"
                            >
                                수정하기
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-5 p-6">
                    <div className="space-y-2">
                        <Label className="text-base font-semibold">제목</Label>
                        <p className="text-gray-900 font-medium px-3 py-2.5 bg-gray-50 rounded-md border border-gray-200">
                            {article.title}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`summary-${article.id}`} className="text-base font-semibold">AI 요약</Label>
                        {isEditing ? (
                            <Textarea
                                id={`summary-${article.id}`}
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                                rows={5}
                                className="border-purple-200 focus:border-purple-400 resize-none"
                            />
                        ) : (
                            <p className="text-gray-700 px-3 py-2.5 bg-gray-50 rounded-md border border-gray-200 min-h-[120px] whitespace-pre-wrap">
                                {article.summary}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`keywords-${article.id}`} className="text-base font-semibold">키워드</Label>
                        {isEditing ? (
                            <>
                                <Input
                                    id={`keywords-${article.id}`}
                                    value={keywords}
                                    onChange={(e) => setKeywords(e.target.value)}
                                    className="border-purple-200 focus:border-purple-400 h-11"
                                    placeholder="키워드1, 키워드2, 키워드3"
                                />
                                <p className="text-xs text-gray-500">쉼표(,)로 구분하여 입력하세요</p>
                            </>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {article.keywords.map((keyword, index) => (
                                    <Badge
                                        key={index}
                                        className="bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 border border-purple-200 px-3 py-1 text-sm font-medium"
                                    >
                                        #{keyword}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                    {isEditing && (
                        <div className="flex gap-2">
                            <Button
                                onClick={handleSave}
                                className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 h-11 shadow-md"
                                size="lg"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                저장하기
                            </Button>
                            <Button
                                onClick={handleCancel}
                                variant="outline"
                                className="border-gray-300 text-gray-700 hover:bg-gray-50 h-11"
                                size="lg"
                            >
                                취소
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

export const IssueEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: publication, isLoading, error } = usePublication(Number(id));
    const updateArticleMutation = useUpdateArticle(Number(id));
    const [qrStatus, setQrStatus] = useState(false);
    const qrCodeRef = useRef<{ download: (fileName?: string) => void }>(null);

    // 페이지네이션 상태
    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 6;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">로딩 중...</p>
                </div>
            </div>
        );
    }

    if (error || !publication) {
        return (
            <div className="p-8">
                <Card className="max-w-2xl mx-auto">
                    <CardContent className="py-16 text-center">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-10 h-10 text-red-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">기사를 찾을 수 없습니다</h3>
                        <p className="text-gray-500 mb-6">요청하신 기사가 존재하지 않습니다</p>
                        <Button
                            onClick={() => navigate('/admin/issues')}
                            className="bg-gradient-to-r from-purple-600 to-violet-600"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            기사 이력으로 돌아가기
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const handleArticleUpdate = (articleId: number, data: { summary: string; keywords: string[] }) => {
        updateArticleMutation.mutate({ articleId, data });
    };

    const handleGenerateQR = () => {
        // TODO: QR 생성 API 연결
        setQrStatus(true);
        toast.success('✨ QR 코드가 생성되었습니다! 기사가 발행되었습니다.');
    };

    const handleDownloadQR = () => {
        if (qrCodeRef.current) {
            qrCodeRef.current.download(`qroad-issue-${publication.paper_id}-qr`);
            toast.success('QR 코드를 다운로드했습니다');
        }
    };

    // 페이지네이션 계산
    const totalPages = publication ? Math.ceil(publication.articles.length / articlesPerPage) : 0;
    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const currentArticles = publication ? publication.articles.slice(startIndex, endIndex) : [];


    // const statusMap = {
    //     created: { label: '생성', color: 'bg-slate-100 text-slate-700 border-slate-300' },
    //     'pre-publish': { label: '발행 전', color: 'bg-amber-100 text-amber-700 border-amber-300' },
    //     published: { label: '발행 완료', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
    // };

    return (
        <div className="p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto"
            >
                {/* Header */}
                <div className="mb-8">
                    <Button
                        onClick={() => navigate('/admin/issues')}
                        variant="ghost"
                        className="mb-4 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        기사 이력으로 돌아가기
                    </Button>

                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-4xl bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-3">
                                기사 상세 관리
                            </h1>
                            <p className="text-gray-600">
                                기사 정보를 확인하고 Article을 수정하며 QR 코드를 생성할 수 있습니다
                            </p>
                        </div>
                        {/* <Badge variant="outline" className={`${statusMap[issue.status].color} px-4 py-2 text-base`}>
                            {statusMap[issue.status].label}
                        </Badge> */}
                    </div>
                </div>

                <Card className="shadow-xl border border-purple-100 overflow-hidden p-0">
                    <CardContent className="p-0">
                        <Tabs defaultValue="info" className="w-full">
                            <div className="px-6 pt-6 pb-6">
                                <TabsList className="grid w-full max-w-2xl grid-cols-3 bg-white/50 h-14 bg-purple-50/80 shadow-sm rounded-xl border border-purple-200/50">
                                    <TabsTrigger
                                        value="info"
                                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-violet-600 data-[state=active]:text-white text-base"
                                    >
                                        <FileText className="w-4 h-4 mr-2" />
                                        기사 정보
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="ai"
                                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-violet-600 data-[state=active]:text-white text-base"
                                    >
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        AI 분석
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="qr"
                                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-violet-600 data-[state=active]:text-white text-base"
                                    >
                                        <QrCode className="w-4 h-4 mr-2" />
                                        QR 코드
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="p-8">
                                {/* Info Tab */}
                                <TabsContent value="info" className="space-y-6 mt-0">
                                    {/* Basic Info */}
                                    <div className="bg-white rounded-xl border border-purple-100 overflow-hidden">
                                        <div className="bg-gradient-to-r from-purple-50 to-violet-50 px-6 py-4 border-b border-purple-100">
                                            <h3 className="font-semibold text-gray-900">기본 정보</h3>
                                        </div>
                                        <div className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div>
                                                    <Label className="text-sm text-gray-500 mb-2 block">호수/제목</Label>
                                                    <p className="font-semibold text-gray-900">{publication.title}</p>
                                                </div>
                                                <div>
                                                    <Label className="text-sm text-gray-500 mb-2 block">발행일자</Label>
                                                    <p className="font-semibold text-gray-900">{publication.published_date}</p>
                                                </div>
                                                {/* <div>
                                                    <Label className="text-sm text-gray-500 mb-2 block">발행자</Label>
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4 text-purple-600" />
                                                        <p className="font-semibold text-gray-900">{issue.publisher || '-'}</p>
                                                    </div>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>

                                    {/* URL Info */}
                                    <div className="bg-white rounded-xl border border-purple-100 overflow-hidden">
                                        <div className="bg-gradient-to-r from-purple-50 to-violet-50 px-6 py-4 border-b border-purple-100">
                                            <h3 className="font-semibold text-gray-900">URL 정보</h3>
                                        </div>
                                        <div className="p-6 space-y-3">
                                            <Label className="text-sm text-gray-500">기사 URL (User Landing Page)</Label>
                                            <Input value={`${window.location.origin}/a/${publication.paper_id}`} readOnly className="bg-gray-50" />
                                            <p className="text-xs text-gray-500">
                                                사용자가 QR 코드를 스캔하면 이 URL로 이동합니다
                                            </p>
                                        </div>
                                    </div>

                                    {/* Original Text */}
                                    <div className="bg-white rounded-xl border border-purple-100 overflow-hidden">
                                        <div className="bg-gradient-to-r from-purple-50 to-violet-50 px-6 py-4 border-b border-purple-100">
                                            <h3 className="font-semibold text-gray-900">원본 텍스트</h3>
                                            <p className="text-xs text-gray-500 mt-1">AI 분석에 사용된 원본 내용입니다</p>
                                        </div>
                                        <div className="p-6">
                                            <Textarea
                                                value={publication.body}
                                                readOnly
                                                rows={12}
                                                className="bg-gray-50 resize-none"
                                            />
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* AI Tab */}
                                <TabsContent value="ai" className="space-y-6 mt-0">
                                    <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl flex items-center justify-center">
                                                <Sparkles className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">AI가 청킹한 Article 목록</h3>
                                                <p className="text-sm text-gray-600">각 Article의 내용을 수정하고 저장할 수 있습니다</p>
                                            </div>
                                        </div>
                                        <Badge className="bg-purple-600 text-white px-4 py-2 text-base">
                                            총 {publication.article_count}개
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {currentArticles.map((article: ArticleInResponse) => (
                                            <ArticleCard
                                                key={article.id}
                                                article={article}
                                                onUpdate={handleArticleUpdate}
                                            />
                                        ))}
                                    </div>

                                    {/* 페이지네이션 */}
                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-center gap-2 mt-8">
                                            <Button
                                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                disabled={currentPage === 1}
                                                variant="outline"
                                                size="sm"
                                                className="border-purple-300 text-purple-600 hover:bg-purple-50 disabled:opacity-50"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </Button>
                                            <span className="text-sm text-gray-600">
                                                {currentPage} / {totalPages}
                                            </span>
                                            <Button
                                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                                disabled={currentPage === totalPages}
                                                variant="outline"
                                                size="sm"
                                                className="border-purple-300 text-purple-600 hover:bg-purple-50 disabled:opacity-50"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    )}

                                    {publication.articles.length === 0 && (
                                        <div className="text-center py-20">
                                            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Sparkles className="w-10 h-10 text-purple-600" />
                                            </div>
                                            <h3 className="text-xl font-semibold mb-2">Article이 아직 생성되지 않았습니다</h3>
                                            <p className="text-gray-500">AI 처리를 기다리거나 수동으로 Article을 추가하세요</p>
                                        </div>
                                    )}
                                </TabsContent>

                                {/* QR Tab */}
                                <TabsContent value="qr" className="mt-0">
                                    {!qrStatus ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-center py-16"
                                        >
                                            <Card className="max-w-xl mx-auto border-purple-200 shadow-lg overflow-hidden p-0">
                                                <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 p-5">
                                                    <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <QrCode className="w-10 h-10 text-white" />
                                                    </div>
                                                    <CardTitle className="text-2xl text-purple-900">QR 코드 미생성</CardTitle>
                                                    <CardDescription className="text-base mt-2">
                                                        QR 코드를 생성하여 기사를 발행하세요
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="p-8">
                                                    <Button
                                                        onClick={handleGenerateQR}
                                                        className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 h-14 text-base shadow-lg shadow-purple-500/30"
                                                        size="lg"
                                                    >
                                                        <QrCode className="w-5 h-5 mr-2" />
                                                        QR 생성 및 기사 발행하기
                                                    </Button>
                                                    <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                                                        <p className="text-sm text-amber-900">
                                                            ⚠️ 이 버튼을 누르면 기사 상태가 <strong>'발행 완료'</strong>로 변경되고 QR 코드가 생성됩니다.
                                                        </p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="space-y-6"
                                        >
                                            <Card className="max-w-2xl mx-auto border-emerald-200 shadow-lg overflow-hidden p-0">
                                                <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 p-5">
                                                    <div className="flex items-center gap-3 justify-center">
                                                        <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                                                            <QrCode className="w-6 h-6 text-white" />
                                                        </div>
                                                        <div className="text-center">
                                                            <CardTitle className="text-2xl text-emerald-900">QR 코드 생성 완료</CardTitle>
                                                            <CardDescription className="mt-1">QR 코드가 성공적으로 생성되었습니다</CardDescription>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="p-8 space-y-8">
                                                    <div className="flex justify-center">
                                                        <motion.div
                                                            initial={{ scale: 0.8 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ type: "spring", stiffness: 200 }}
                                                            className="bg-white p-6 rounded-2xl shadow-2xl border-4 border-purple-200"
                                                        >
                                                            <QRCodeGenerator
                                                                ref={qrCodeRef}
                                                                url={`${window.location.origin}/a/${publication.paper_id}`}
                                                                size={300}
                                                            />
                                                        </motion.div>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <Label className="text-base font-semibold">기사 URL</Label>
                                                        <Input
                                                            value={`${window.location.origin}/a/${publication.paper_id}`}
                                                            readOnly
                                                            className="border-purple-200 bg-purple-50 h-12 text-center font-mono"
                                                        />
                                                    </div>
                                                    <Button
                                                        onClick={handleDownloadQR}
                                                        className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 h-14 text-base shadow-lg"
                                                        size="lg"
                                                    >
                                                        <Download className="w-5 h-5 mr-2" />
                                                        QR 코드 다운로드 (PNG)
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    )}
                                </TabsContent>
                            </div>
                        </Tabs>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};
