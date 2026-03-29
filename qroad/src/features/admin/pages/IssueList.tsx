import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, Loader2 } from 'lucide-react';
import { usePublications } from '@/hooks/admin/usePublications';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 10;

// Mock data generation for missing fields
const categories = ['경제', '문화', '교통', '안전', '행사'];
const getCategory = (id: number) => categories[id % categories.length];
const getViews = (id: number) => (id * 123 + 456).toLocaleString();
const formatIssueNumber = (dateString: string) => {
    if (!dateString) return '2024-01';
    return dateString.substring(0, 7); // Extracts "2024-01" from "2024-01-15"
};
const formatPublishedDate = (dateString: string) => {
    if (!dateString) return '2024.01.15';
    return dateString.split('-').join('.');
};
export const IssueList = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedMonth, searchKeyword]);

    const { data, isLoading, error } = usePublications({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        month: selectedMonth || undefined,
        q: searchKeyword || undefined,
    });

    // 로그인 직후 환영 메시지 표시
    useEffect(() => {
        const justLoggedIn = localStorage.getItem('justLoggedIn');
        const loginId = localStorage.getItem('loginId');

        if (justLoggedIn === 'true') {
            toast.success(`${loginId || '관리자'}님, 로그인했습니다`);
            localStorage.removeItem('justLoggedIn');
        }
    }, []);

    const totalPages = data ? Math.ceil(data.total_count / ITEMS_PER_PAGE) : 0;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, data?.total_count || 0);
    const publications = data?.papers || [];

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <Loader2 className="w-10 h-10 text-[#3B82F6] animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full w-full text-[#EF4444]">
                기사 목록을 불러올 수 없습니다.
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-[#F9FAFB] p-8 font-['Inter'] relative">
            
            {/* Page Header */}
            <div>
                <h1 className="font-semibold text-[24px] leading-[32px] tracking-[-0.5px] text-[#111827]">
                    전체 기사 목록
                </h1>
                <p className="mt-[10px] font-normal text-[16px] leading-[24px] tracking-[-0.5px] text-[#4B5563]">
                    기사를 클릭하여 상세 정보를 확인하고 수정할 수 있습니다
                </p>
            </div>

            {/* Toolbar */}
            <div className="mt-[54px] w-full flex items-center justify-between">
                <div className="flex gap-[16px]">
                    <div className="relative">
                        <input
                            type="month"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="w-[160px] h-[37px] bg-[#FFFFFF] border border-[#D1D5DB] rounded-[8px] px-3 font-normal text-[14px] leading-[17px] tracking-[-0.5px] text-[#000000] outline-none"
                        />
                    </div>
                    {selectedMonth && (
                        <button
                            type="button"
                            onClick={() => setSelectedMonth('')}
                            className="h-[37px] px-3 bg-[#FFFFFF] border border-[#D1D5DB] rounded-[8px] font-normal text-[14px] text-[#374151]"
                        >
                            전체
                        </button>
                    )}
                </div>

                <div className="relative">
                    <input 
                        type="text" 
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key !== 'Enter' || e.nativeEvent.isComposing) return;
                            setSearchKeyword(searchInput.trim());
                        }}
                        placeholder="호수(예: 2026-03) 또는 기사 제목 검색..." 
                        className="w-[360px] h-[38px] bg-[#FFFFFF] border border-[#D1D5DB] rounded-[8px] pl-10 pr-4 font-normal text-[14px] leading-[20px] tracking-[-0.5px] placeholder:text-[rgba(0,0,0,0.5)] outline-none focus:border-[#3B82F6]"
                    />
                    <Search className="absolute left-[12px] top-[11px] w-4 h-4 text-[#9CA3AF]" />
                </div>
            </div>

            {/* Table Area */}
            <div className="mt-6 w-full bg-[#FFFFFF] border border-[#E5E7EB] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] rounded-[8px] overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                        <tr>
                            <th className="w-[165px] h-[48.5px] font-medium text-[12px] leading-[15px] tracking-[0.1px] text-[#6B7280] text-center font-['Inter']">호수</th>
                            <th className="w-[491px] h-[48.5px] font-medium text-[12px] leading-[15px] tracking-[0.1px] text-[#6B7280] text-center font-['Inter']">제목</th>
                            <th className="w-[156px] h-[48.5px] font-medium text-[12px] leading-[15px] tracking-[0.1px] text-[#6B7280] text-center font-['Inter']">카테고리</th>
                            <th className="w-[191px] h-[48.5px] font-medium text-[12px] leading-[15px] tracking-[0.1px] text-[#6B7280] text-center font-['Inter']">발행일</th>
                            <th className="w-[136px] h-[48.5px] font-medium text-[12px] leading-[15px] tracking-[0.1px] text-[#6B7280] text-center font-['Inter']">조회수</th>
                            <th className="w-[215px] h-[48.5px] font-medium text-[12px] leading-[15px] tracking-[0.1px] text-[#6B7280] text-center font-['Inter']">관리</th>
                        </tr>
                    </thead>
                    <tbody className="bg-[#FFFFFF]">
                        {publications.length > 0 ? (
                            publications.map((pub, idx) => {
                                return (
                                    <tr 
                                        key={pub.id} 
                                        onClick={() => navigate(`/admin/issues/${pub.id}`)}
                                        className={`h-[69px] border-b border-[#E5E7EB] cursor-pointer hover:bg-[#F9FAFB] transition-colors ${idx === publications.length - 1 ? 'border-none' : ''}`}
                                    >
                                        <td className="text-center font-medium text-[14px] leading-[17px] tracking-[-0.5px] text-[#111827]">
                                            {formatIssueNumber(pub.published_date)}
                                        </td>
                                        <td className="text-center font-normal text-[14px] leading-[17px] tracking-[-0.5px] text-[#111827] px-4 truncate max-w-[490px]">
                                            {pub.title}
                                        </td>
                                        <td className="text-center font-normal text-[14px] leading-[17px] tracking-[-0.5px] text-[#6B7280]">
                                            {getCategory(pub.id)}
                                        </td>
                                        <td className="text-center font-normal text-[14px] leading-[17px] tracking-[-0.5px] text-[#6B7280]">
                                            {formatPublishedDate(pub.published_date)}
                                        </td>
                                        <td className="text-center font-normal text-[14px] leading-[17px] tracking-[-0.5px] text-[#6B7280]">
                                            {getViews(pub.id)}
                                        </td>
                                        <td className="text-center">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/admin/issues/${pub.id}`);
                                                }}
                                                className="w-[88px] h-[36px] bg-[#3B82F6] hover:bg-[#2563EB] active:bg-[#1D4ED8] rounded-[8px] font-medium text-[14px] leading-[17px] tracking-[-0.5px] text-[#FFFFFF] transition-colors"
                                            >
                                                상세보기
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-10 font-normal text-[14px] text-[#6B7280]">
                                    표시할 기사가 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {publications.length > 0 && (
                <div className="mt-[24px] w-full flex items-center justify-between">
                    <div className="flex items-center">
                        <span className="font-normal text-[14px] leading-[17px] tracking-[-0.5px] text-[#374151]">
                            총 <span className="font-medium text-[14px] leading-[20px]">{data?.total_count || 0}</span> 개 기사 중 <span className="font-medium text-[14px] leading-[20px] tracking-[-0.7px]">{startIndex + 1}-{endIndex}</span> 개 표시
                        </span>
                    </div>

                    <div className="flex items-center gap-[8px]">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            className="w-[34.75px] h-[38px] bg-[#FFFFFF] border border-[#D1D5DB] rounded-[8px] flex items-center justify-center disabled:opacity-50 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4 text-[#6B7280]" />
                        </button>
                        
                        {totalPages > 1 ? (
                            getPageNumbers().map((page, index) => (
                                page === '...' ? (
                                    <span key={`ellipsis-${index}`} className="font-normal text-[14px] leading-[20px] tracking-[-0.5px] text-[#6B7280] px-1">...</span>
                                ) : (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page as number)}
                                        className={`min-w-[31.81px] h-[38px] px-[12px] border rounded-[8px] font-medium text-[14px] leading-[17px] tracking-[-0.5px] text-center transition-colors ${
                                            currentPage === page 
                                                ? 'bg-[#3B82F6] border-[#3B82F6] text-[#FFFFFF]' 
                                                : 'bg-[#FFFFFF] border-[#D1D5DB] text-[#374151] hover:bg-[#F9FAFB]'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                )
                            ))
                        ) : (
                            <button className="min-w-[31.81px] h-[38px] px-[12px] bg-[#3B82F6] border border-[#3B82F6] text-[#FFFFFF] rounded-[8px] font-medium text-[14px] leading-[17px] tracking-[-0.5px] text-center">
                                1
                            </button>
                        )}

                        <button 
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            className="w-[34.75px] h-[38px] bg-[#FFFFFF] border border-[#D1D5DB] rounded-[8px] flex items-center justify-center disabled:opacity-50 transition-colors"
                        >
                            <ChevronRight className="w-4 h-4 text-[#374151]" />
                        </button>
                    </div>
                </div>
            )}
            
        </div>
    );
};
