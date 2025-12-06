import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Eye, Calendar, FileText, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { usePublications } from '@/hooks/admin/usePublications';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 10;

export const IssueList = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const { data, isLoading, error } = usePublications({ page: currentPage, limit: ITEMS_PER_PAGE });

    // 로그인 직후 환영 메시지 표시
    useEffect(() => {
        console.log('=== IssueList 마운트 ===');
        const justLoggedIn = localStorage.getItem('justLoggedIn');
        const loginId = localStorage.getItem('loginId');

        console.log('justLoggedIn:', justLoggedIn);
        console.log('loginId:', loginId);

        if (justLoggedIn === 'true') {
            console.log('로그인 알람 표시!');
            toast.success(`${loginId}님, 로그인했습니다`);
            localStorage.removeItem('justLoggedIn'); // 플래그 제거
        }
    }, []);

    // Pagination
    const totalPages = data ? Math.ceil(data.total_count / ITEMS_PER_PAGE) : 0;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, data?.total_count || 0);

    // Pagination buttons
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">기사 목록을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <Card className="max-w-2xl mx-auto">
                    <CardContent className="py-16 text-center">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-10 h-10 text-red-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">기사 목록을 불러올 수 없습니다</h3>
                        <p className="text-gray-500">잠시 후 다시 시도해주세요</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const publications = data?.papers || [];

    return (
        <div className="p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto"
            >
                {/* Main Content Card */}
                <Card className="shadow-lg border border-purple-100 overflow-hidden p-0">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-100 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl text-gray-900">
                                    전체 기사 목록
                                </CardTitle>
                                <CardDescription className="mt-2">
                                    기사를 클릭하여 상세 정보를 확인하고 수정할 수 있습니다
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        {/* Filter */}
                        <div className="mb-6 flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                총 {data?.total_count || 0}개 중 {startIndex + 1}-{endIndex}개 표시
                            </div>
                        </div>

                        {/* Table */}
                        <div className="rounded-xl border border-purple-100 overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-purple-50 hover:bg-purple-50">
                                        <TableHead className="font-semibold text-center">호수</TableHead>
                                        <TableHead className="font-semibold text-center">내용</TableHead>
                                        <TableHead className="font-semibold text-center">일자</TableHead>
                                        <TableHead className="font-semibold text-center">URL</TableHead>
                                        <TableHead className="font-semibold text-center">확인</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {publications.map((publication) => (
                                        <TableRow
                                            key={publication.id}
                                            className="hover:bg-purple-50/50 cursor-pointer transition-colors"
                                            onClick={() => navigate(`/ admin / issues / ${publication.id} `)}
                                        >
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-purple-600" />
                                                    <span className="font-semibold text-gray-900">{publication.title}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-left max-w-md">
                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    {publication.body}
                                                </p>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-2 text-gray-600">
                                                    <Calendar className="w-4 h-4" />
                                                    {publication.published_date}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center max-w-xs">
                                                <a
                                                    href={`${window.location.origin} /a/${publication.id} `}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline truncate inline-block max-w-full"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {`${window.location.origin} /a/${publication.id} `}
                                                </a>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Button
                                                    size="sm"
                                                    className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/ admin / issues / ${publication.id} `);
                                                    }}
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    상세보기
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {publications.length === 0 && (
                            <div className="text-center py-16">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-8 h-8 text-purple-600" />
                                </div>
                                <p className="text-gray-500 mb-2">표시할 기사가 없습니다</p>
                                <p className="text-sm text-gray-400">새로운 기사를 발행해보세요</p>
                            </div>
                        )}

                        {/* Pagination */}
                        {publications.length > 0 && (
                            <div className="flex items-center justify-center gap-2 mt-6">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="border-purple-200"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>

                                {totalPages > 1 ? (
                                    getPageNumbers().map((page, index) => (
                                        page === '...' ? (
                                            <span key={`ellipsis - ${index} `} className="px-2 text-gray-400">...</span>
                                        ) : (
                                            <Button
                                                key={page}
                                                variant={currentPage === page ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setCurrentPage(page as number)}
                                                className={
                                                    currentPage === page
                                                        ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white"
                                                        : "border-purple-200 hover:bg-purple-50"
                                                }
                                            >
                                                {page}
                                            </Button>
                                        )
                                    ))
                                ) : (
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="bg-gradient-to-r from-purple-600 to-violet-600 text-white"
                                    >
                                        1
                                    </Button>
                                )}

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className="border-purple-200"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};
