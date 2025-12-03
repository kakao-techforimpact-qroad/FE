import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ArrowLeft, Sparkles, Send } from 'lucide-react';
import { useCreatePublication } from '@/hooks/admin/usePublications';
import { toast } from 'sonner';

export const IssueCreate = () => {
    const navigate = useNavigate();
    const [issueNum, setIssueNum] = useState('');
    const [issueDate, setIssueDate] = useState('');
    const [rawText, setRawText] = useState('');

    const createMutation = useCreatePublication();
    const isLoading = createMutation.isPending;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 날짜 형식 검증
        if (!issueDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
            toast.error('올바른 날짜 형식을 선택해주세요');
            return;
        }

        // API 호출
        createMutation.mutate({
            title: issueNum,
            content: rawText,
            publishedDate: issueDate,
        });
    };

    return (
        <div className="p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
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

                    <h1 className="text-4xl bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-3">
                        기사 발행
                    </h1>
                    <p className="text-gray-600">
                        새로운 기사를 발행합니다. AI가 자동으로 내용을 분석하여 청킹/요약/키워드를 추출합니다.
                    </p>
                </div>

                <Card className="shadow-xl border border-purple-100 overflow-hidden p-0">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-100 p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl text-gray-900">
                                    기사 정보 입력
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    모든 필드는 필수 입력 항목입니다
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Two Column Layout for Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label htmlFor="issue_num" className="text-base">
                                        호수/제목 <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="issue_num"
                                        type="text"
                                        placeholder="예: 2024-11-25"
                                        value={issueNum}
                                        onChange={(e) => setIssueNum(e.target.value)}
                                        className="border-purple-200 focus:border-purple-400 focus:ring-purple-400 h-12 text-base"
                                        required
                                    />
                                    <p className="text-xs text-gray-500">
                                        기사를 구분할 수 있는 고유 번호를 입력하세요
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="issue_date" className="text-base">
                                        발행일자 <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="issue_date"
                                        type="date"
                                        value={issueDate}
                                        onChange={(e) => setIssueDate(e.target.value)}
                                        className="border-purple-200 focus:border-purple-400 focus:ring-purple-400 h-12 text-base"
                                        required
                                    />
                                    <p className="text-xs text-gray-500">
                                        기사가 발행되는 날짜를 선택하세요
                                    </p>
                                </div>
                            </div>

                            {/* Publisher Field */}
                            {/* <div className="space-y-3">
                                <Label htmlFor="publisher" className="text-base">
                                    발행자 <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="publisher"
                                    type="text"
                                    placeholder="예: QRoad 편집팀"
                                    value={publisher}
                                    onChange={(e) => setPublisher(e.target.value)}
                                    className="border-purple-200 focus:border-purple-400 focus:ring-purple-400 h-12 text-base"
                                    required
                                />
                                <p className="text-xs text-gray-500">
                                    기사를 발행하는 담당자 또는 팀의 이름을 입력하세요
                                </p>
                            </div> */}

                            {/* Content Field */}
                            <div className="space-y-3">
                                <Label htmlFor="raw_text" className="text-base">
                                    기사 내용 (원본 텍스트) <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="raw_text"
                                    placeholder="신문사 원본 텍스트를 입력하세요...&#x0a;&#x0a;AI가 이 텍스트를 자동으로 분석하여:&#x0a;• 의미 단위로 청킹&#x0a;• 각 섹션 요약&#x0a;• 주요 키워드 추출&#x0a;&#x0a;작업을 수행합니다."
                                    value={rawText}
                                    onChange={(e) => setRawText(e.target.value)}
                                    className="border-purple-200 focus:border-purple-400 focus:ring-purple-400 min-h-[400px] text-base"
                                    required
                                />
                                <div className="flex items-start gap-2 p-4 bg-purple-50 rounded-lg border border-purple-200">
                                    <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-purple-900 font-medium mb-1">AI 자동 처리 안내</p>
                                        <p className="text-xs text-purple-700">
                                            입력하신 텍스트는 AI에 의해 자동으로 분석되어 여러 개의 Article로 분할되고, 각각 요약 및 키워드가 추출됩니다.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate('/admin/issues')}
                                    disabled={isLoading}
                                    className="min-w-32 h-12"
                                    size="lg"
                                >
                                    취소
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 min-w-40 h-12 shadow-lg shadow-purple-500/30"
                                    disabled={isLoading}
                                    size="lg"
                                >
                                    {isLoading ? (
                                        <>
                                            <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                                            AI 처리 중...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5 mr-2" />
                                            기사 발행하기
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Help Section */}
                <Card className="mt-6 border-purple-100 bg-gradient-to-br from-purple-50 to-violet-50">
                    <CardContent className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-3">💡 사용 팁</h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-purple-600">•</span>
                                <span>호수/지면 넘버는 고유해야 하며, 날짜 형식을 권장합니다 (예: 2024-11-25)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-600">•</span>
                                <span>원본 텍스트는 가능한 한 완전한 문장으로 입력해주세요</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-600">•</span>
                                <span>발행 후 AI 탭에서 자동 생성된 Article들을 확인하고 수정할 수 있습니다</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-600">•</span>
                                <span>QR 코드는 모든 내용 확인 후 QR 탭에서 생성할 수 있습니다</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};
