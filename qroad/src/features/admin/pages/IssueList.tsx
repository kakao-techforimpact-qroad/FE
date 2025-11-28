import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Eye, Calendar, User, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { getIssues } from '@/mock/admin/mockData';

// const statusMap = {
//     created: { label: '생성', color: 'bg-slate-100 text-slate-700 border-slate-300' },
//     'pre-publish': { label: '발행 전', color: 'bg-amber-100 text-amber-700 border-amber-300' },
//     published: { label: '발행 완료', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
// };

const ITEMS_PER_PAGE = 10;

export const IssueList = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const issues = getIssues();

    // Pagination
    const totalPages = Math.ceil(issues.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedIssues = issues.slice(startIndex, endIndex);

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

    return (
        <div className="p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto"
            >
                {/* Header */}
                {/* <div className="mb-8">
                    <h1 className="text-4xl bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-3">
                        기사 이력
                    </h1>
                    <p className="text-gray-600">
                        발행된 모든 기사를 확인하고 관리할 수 있습니다
                    </p>
                </div> */}

                {/* Stats Cards */}
                {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card className="border-purple-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">전체 기사</p>
                                    <p className="text-3xl text-purple-600">{issues.length}</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-emerald-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">발행 완료</p>
                                    <p className="text-3xl text-emerald-600">
                                        {issues.filter(i => i.status === 'published').length}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-emerald-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-amber-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">발행 대기</p>
                                    <p className="text-3xl text-amber-600">
                                        {issues.filter(i => i.status === 'pre-publish').length}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-amber-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">작성 중</p>
                                    <p className="text-3xl text-slate-600">
                                        {issues.filter(i => i.status === 'created').length}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                                    <User className="w-6 h-6 text-slate-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div> */}

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
                            {/* <div className="flex items-center gap-4">
                                <label className="font-medium text-gray-700">상태 필터:</label>
                                <Select value={statusFilter} onValueChange={handleFilterChange}>
                                    <SelectTrigger className="w-48 border-purple-200 focus:ring-purple-500">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">전체 ({issues.length})</SelectItem>
                                        <SelectItem value="created">작성 중 ({issues.filter(i => i.status === 'created').length})</SelectItem>
                                        <SelectItem value="pre-publish">발행 대기 ({issues.filter(i => i.status === 'pre-publish').length})</SelectItem>
                                        <SelectItem value="published">발행 완료 ({issues.filter(i => i.status === 'published').length})</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div> */}
                            <div className="text-sm text-gray-500">
                                총 {issues.length}개 중 {startIndex + 1}-{Math.min(endIndex, issues.length)}개 표시
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
                                        {/* <TableHead className="font-semibold text-center">발행자</TableHead> */}
                                        <TableHead className="font-semibold text-center">URL</TableHead>
                                        {/* <TableHead className="font-semibold text-center">상태</TableHead> */}
                                        <TableHead className="font-semibold text-center">확인</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedIssues.map((issue) => (
                                        <TableRow
                                            key={issue.id}
                                            className="hover:bg-purple-50/50 cursor-pointer transition-colors"
                                            onClick={() => navigate(`/admin/issues/${issue.id}`)}
                                        >
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-purple-600" />
                                                    <span className="font-semibold text-gray-900">{issue.issue_title}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-left max-w-md">
                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    {issue.original_snippet}
                                                </p>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-2 text-gray-600">
                                                    <Calendar className="w-4 h-4" />
                                                    {issue.issue_date}
                                                </div>
                                            </TableCell>
                                            {/* <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                                        <User className="w-4 h-4 text-purple-600" />
                                                    </div>
                                                    <span className="text-sm text-gray-700">{issue.publisher || '-'}</span>
                                                </div>
                                            </TableCell> */}
                                            <TableCell className="text-center max-w-xs">
                                                <a
                                                    href={issue.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline truncate inline-block max-w-full"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {issue.url}
                                                </a>
                                            </TableCell>
                                            {/* <TableCell className="text-center">
                                                <div className="flex justify-center">
                                                    <Badge variant="outline" className={statusMap[issue.status].color}>
                                                        {statusMap[issue.status].label}
                                                    </Badge>
                                                </div>
                                            </TableCell> */}
                                            <TableCell className="text-center">
                                                <Button
                                                    size="sm"
                                                    className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/admin/issues/${issue.id}`);
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

                        {issues.length === 0 && (
                            <div className="text-center py-16">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-8 h-8 text-purple-600" />
                                </div>
                                <p className="text-gray-500 mb-2">표시할 기사가 없습니다</p>
                                <p className="text-sm text-gray-400">새로운 기사를 발행해보세요</p>
                            </div>
                        )}

                        {/* Pagination */}
                        {issues.length > 0 && (
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
                                            <span key={`ellipsis-${index}`} className="px-2 text-gray-400">...</span>
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
