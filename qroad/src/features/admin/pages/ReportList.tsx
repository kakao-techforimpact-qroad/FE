import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, X } from 'lucide-react';
import { reportsApi } from '@/api/admin/reports';
import { Report, ReportListResponse, ReportDetailResponse } from '@/types/admin';

export const ReportList = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reportDetail, setReportDetail] = useState<ReportDetailResponse | null>(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res: ReportListResponse = await reportsApi.getAll({ page: 1, limit: 10 });
                setReports(res.reports);
            } catch (error) {
                console.error('Failed to fetch reports:', error);
            } finally {
                setIsLoading(false);
            }
        };

        void fetchReports();
    }, []);

    const handleOpenModal = async (reportId: number) => {
        setIsModalOpen(true);
        setIsLoadingDetail(true);
        setReportDetail(null);
        try {
            const detail = await reportsApi.getById(reportId);
            setReportDetail(detail);
        } catch (error) {
            console.error('Failed to fetch report detail:', error);
            alert('상세 정보를 불러오는 데 실패했습니다.');
            setIsModalOpen(false);
        } finally {
            setIsLoadingDetail(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setReportDetail(null);
    };

    return (
        <div className="w-full min-h-full font-['Inter'] relative bg-[#F9FAFB] p-[48px] overflow-x-auto">
            <div className="w-full max-w-[1544px] mb-[36px]">
                <div className="flex items-center gap-[8px] cursor-pointer w-fit mb-[16px]" onClick={() => navigate(-1)}>
                    <ChevronLeft className="w-[12px] h-[14px] text-[#2563EB]" />
                    <span className="font-normal text-[14px] leading-[17px] tracking-[-0.5px] text-[#2563EB]">
                        이전으로 돌아가기
                    </span>
                </div>

                <h2 className="font-normal text-[36px] leading-[44px] tracking-[-0.5px] text-[#111827] mb-[8px]">
                    제보 확인
                </h2>
                <p className="font-normal text-[16px] leading-[20px] tracking-[-0.5px] text-[#4B5563]">
                    사용자가 제출한 제보 내용을 확인할 수 있습니다.
                </p>
            </div>

            <div className="w-full max-w-[1544px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] overflow-hidden mb-[100px]">
                <div className="w-full h-[62px] border-b border-[#E5E7EB] px-[24px] flex items-center">
                    <h3 className="font-medium text-[18px] leading-[22px] tracking-[-0.5px] text-[#111827]">제보 목록</h3>
                </div>

                <div className="w-full h-[45px] bg-[#F9FAFB] border-b border-[#E5E7EB] grid grid-cols-[minmax(150px,2fr)_minmax(150px,2fr)_150px_120px] items-center px-[25px]">
                    <div className="font-medium text-[14px] leading-[17px] tracking-[-0.5px] text-[#374151] text-center">제목</div>
                    <div className="font-medium text-[14px] leading-[17px] tracking-[-0.5px] text-[#374151] text-center">제보자 연락처</div>
                    <div className="font-medium text-[14px] leading-[17px] tracking-[-0.5px] text-[#374151] text-center">접수일</div>
                    <div className="font-medium text-[14px] leading-[17px] tracking-[-0.5px] text-[#374151] text-center">상세보기</div>
                </div>

                <div className="w-full flex flex-col min-h-[300px]">
                    {isLoading ? (
                        <div className="w-full py-20 flex justify-center items-center text-[#6B7280]">로딩 중...</div>
                    ) : reports.length === 0 ? (
                        <div className="w-full py-20 flex justify-center items-center text-[#6B7280]">
                            제보 내역이 없습니다.
                        </div>
                    ) : (
                        reports.map((report) => (
                            <div
                                key={report.report_id}
                                className="w-full h-[57px] border-b border-[#F3F4F6] grid grid-cols-[minmax(150px,2fr)_minmax(150px,2fr)_150px_120px] items-center px-[25px]"
                            >
                                <div className="font-normal text-[14px] leading-[17px] tracking-[-0.5px] text-[#111827] truncate px-4 text-center">
                                    {report.title}
                                </div>
                                <div className="font-normal text-[14px] leading-[17px] tracking-[-0.5px] text-[#4B5563] truncate px-4 text-center">
                                    {report.reporter_name || report.reporter_region || '-'}
                                </div>
                                <div className="font-normal text-[14px] leading-[17px] tracking-[-0.5px] text-[#4B5563] text-center">
                                    {report.created_at ? report.created_at.split('T')[0].replace(/-/g, '.') : '-'}
                                </div>
                                <div className="flex justify-center items-center">
                                    <button
                                        className="font-normal text-[14px] leading-[17px] tracking-[-0.5px] text-[#2563EB] hover:underline transition-colors"
                                        onClick={() => handleOpenModal(report.report_id)}
                                    >
                                        상세보기
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    {/* Modal Box */}
                    <div className="w-[500px] max-h-[85vh] bg-[#FFFFFF] rounded-[16px] shadow-2xl flex flex-col overflow-hidden font-['Noto_Sans_KR']">
                        {/* Header */}
                        <div className="w-full px-6 py-5 border-b border-[#E5E7EB] flex justify-between items-center bg-[#F9FAFB] rounded-t-[16px]">
                            <h3 className="text-[18px] font-medium text-[#111827] tracking-[-0.5px]">제보 상세 정보</h3>
                            <button onClick={handleCloseModal} className="text-[#6B7280] hover:text-[#111827] transition-colors p-1 rounded-full hover:bg-gray-200">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        {/* Body */}
                        <div className="flex-1 p-6 overflow-y-auto">
                            {isLoadingDetail ? (
                                <div className="w-full h-[200px] flex justify-center items-center text-[#6B7280]">
                                    상세 정보를 불러오는 중...
                                </div>
                            ) : reportDetail ? (
                                <div className="flex flex-col gap-5">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[13px] font-medium text-[#6B7280]">제목</label>
                                        <div className="text-[16px] text-[#111827] bg-[#F9FAFB] p-3 rounded-[8px] border border-[#E5E7EB]">
                                            {reportDetail.title}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[13px] font-medium text-[#6B7280]">제보자 연락처</label>
                                        <div className="text-[15px] text-[#111827] bg-[#F9FAFB] p-3 rounded-[8px] border border-[#E5E7EB]">
                                            {reportDetail.reporterContact || '-'}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[13px] font-medium text-[#6B7280]">접수 일시</label>
                                        <div className="text-[15px] text-[#111827] bg-[#F9FAFB] p-3 rounded-[8px] border border-[#E5E7EB]">
                                            {reportDetail.createdAt ? new Date(reportDetail.createdAt).toLocaleString('ko-KR') : '-'}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[13px] font-medium text-[#6B7280]">제보 내용</label>
                                        <div className="text-[15px] leading-[24px] text-[#111827] bg-[#F9FAFB] p-4 rounded-[8px] border border-[#E5E7EB] min-h-[120px] whitespace-pre-wrap">
                                            {reportDetail.content}
                                        </div>
                                    </div>
                                    
                                </div>
                            ) : (
                                <div className="w-full h-[200px] flex justify-center items-center text-[#EF4444]">
                                    정보를 표시할 수 없습니다.
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="w-full p-4 border-t border-[#E5E7EB] flex justify-end bg-[#FFFFFF] rounded-b-[16px]">
                            <button 
                                onClick={handleCloseModal}
                                className="px-5 py-2.5 bg-[#111827] text-white text-[14px] font-medium rounded-[8px] hover:bg-[#374151] transition-colors"
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
