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
import { ArrowLeft, Download, QrCode, Save, Sparkles, FileText, User } from 'lucide-react';
import { getIssue, getArticlesByIssue, updateArticle, updateIssue, Article } from '@/mock/admin/mockData';
import { toast } from 'sonner';
import { QRCodeGenerator } from '@/shared/components/QRCodeGenerator';

const ArticleCard = ({ article, onSave }: { article: Article; onSave: () => void }) => {
    const [title, setTitle] = useState(article.title);
    const [summary, setSummary] = useState(article.summary);
    const [keywords, setKeywords] = useState(article.keywords.join(', '));

    const handleSave = () => {
        const updatedArticle = {
            ...article,
            title,
            summary,
            keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
        };
        updateArticle(article.id, updatedArticle);
        toast.success('Article이 저장되었습니다');
        onSave();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full"
        >
            <Card className="h-full border-purple-200 hover:shadow-xl transition-shadow">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50">
                    <div className="flex items-center justify-between">
                        <Badge variant="outline" className="bg-white text-purple-700 border-purple-300 font-semibold">
                            순서: {article.order}
                        </Badge>
                        <div className="text-xs text-gray-500">Article #{article.id}</div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-5 p-6">
                    <div className="space-y-2">
                        <Label htmlFor={`title-${article.id}`} className="text-base font-semibold">제목</Label>
                        <Input
                            id={`title-${article.id}`}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border-purple-200 focus:border-purple-400 h-11"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`summary-${article.id}`} className="text-base font-semibold">AI 요약</Label>
                        <Textarea
                            id={`summary-${article.id}`}
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            rows={5}
                            className="border-purple-200 focus:border-purple-400 resize-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`keywords-${article.id}`} className="text-base font-semibold">키워드</Label>
                        <Input
                            id={`keywords-${article.id}`}
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            className="border-purple-200 focus:border-purple-400 h-11"
                            placeholder="키워드1, 키워드2, 키워드3"
                        />
                        <p className="text-xs text-gray-500">쉼표(,)로 구분하여 입력하세요</p>
                    </div>
                    <Button
                        onClick={handleSave}
                        className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 h-11 shadow-md"
                        size="lg"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        저장하기
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export const IssueEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const issue = getIssue(Number(id));
    const [articles, setArticles] = useState(issue ? getArticlesByIssue(issue.id) : []);
    const [qrStatus, setQrStatus] = useState(issue?.qr_status || false);
    const [qrUrl, setQrUrl] = useState(issue?.qr_url || '');
    const qrCodeRef = useRef<{ download: (fileName?: string) => void }>(null);

    if (!issue) {
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

    const handleArticleSave = () => {
        setArticles(getArticlesByIssue(issue.id));
    };

    const handleGenerateQR = () => {
        const url = `https://qroad.app/issue/${issue.id}`;

        updateIssue(issue.id, {
            status: 'published',
            qr_status: true,
            qr_url: url,
        });

        setQrStatus(true);
        setQrUrl(url);
        toast.success('✨ QR 코드가 생성되었습니다! 기사가 발행되었습니다.');
    };

    const handleDownloadQR = () => {
        if (qrCodeRef.current) {
            qrCodeRef.current.download(`qroad-issue-${issue.id}-qr`);
            toast.success('QR 코드를 다운로드했습니다');
        }
    };

    const statusMap = {
        created: { label: '생성', color: 'bg-slate-100 text-slate-700 border-slate-300' },
        'pre-publish': { label: '발행 전', color: 'bg-amber-100 text-amber-700 border-amber-300' },
        published: { label: '발행 완료', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
    };

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
                        <Badge variant="outline" className={`${statusMap[issue.status].color} px-4 py-2 text-base`}>
                            {statusMap[issue.status].label}
                        </Badge>
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
                                                    <Label className="text-sm text-gray-500 mb-2 block">호수/지면 넘버</Label>
                                                    <p className="font-semibold text-gray-900">{issue.issue_num}</p>
                                                </div>
                                                <div>
                                                    <Label className="text-sm text-gray-500 mb-2 block">발행일자</Label>
                                                    <p className="font-semibold text-gray-900">{issue.issue_date}</p>
                                                </div>
                                                <div>
                                                    <Label className="text-sm text-gray-500 mb-2 block">발행자</Label>
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4 text-purple-600" />
                                                        <p className="font-semibold text-gray-900">{issue.publisher || '-'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* URL Info */}
                                    <div className="bg-white rounded-xl border border-purple-100 overflow-hidden">
                                        <div className="bg-gradient-to-r from-purple-50 to-violet-50 px-6 py-4 border-b border-purple-100">
                                            <h3 className="font-semibold text-gray-900">URL 정보</h3>
                                        </div>
                                        <div className="p-6 space-y-3">
                                            <Label className="text-sm text-gray-500">기사 URL</Label>
                                            <Input value={issue.url} readOnly className="bg-gray-50" />
                                            <p className="text-xs text-gray-500">
                                                이 URL은 QR 코드 생성 시 사용됩니다
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
                                                value={issue.raw_text}
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
                                            총 {articles.length}개
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {articles.map((article) => (
                                            <ArticleCard
                                                key={article.id}
                                                article={article}
                                                onSave={handleArticleSave}
                                            />
                                        ))}
                                    </div>
                                    {articles.length === 0 && (
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
                                                                url={qrUrl}
                                                                size={300}
                                                            />
                                                        </motion.div>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <Label className="text-base font-semibold">기사 URL</Label>
                                                        <Input
                                                            value={qrUrl}
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
