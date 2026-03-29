import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { reportsApi } from '@/api/admin/reports';
import { Report, ReportListResponse } from '@/types/admin';

export const ReportList = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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

    return (
        <div className="w-full min-h-full font-['Inter'] relative bg-[#F9FAFB] pl-[48px] pt-[48px]">
            <div className="w-[1544px] mb-[36px]">
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

            <div className="w-[1544px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] overflow-hidden">
                <div className="w-full h-[62px] border-b border-[#E5E7EB] px-[24px] flex items-center">
                    <h3 className="font-medium text-[18px] leading-[22px] tracking-[-0.5px] text-[#111827]">제보 목록</h3>
                </div>

                <div className="w-full h-[45px] bg-[#F9FAFB] border-b border-[#E5E7EB] grid grid-cols-5 items-center px-[24px]">
                    <div className="font-medium text-[14px] leading-[17px] tracking-[-0.5px] text-[#374151]">제목</div>
                    <div className="font-medium text-[14px] leading-[17px] tracking-[-0.5px] text-[#374151]">본문</div>
                    <div className="font-medium text-[14px] leading-[17px] tracking-[-0.5px] text-[#374151]">제보자 연락처</div>
                    <div className="font-medium text-[14px] leading-[17px] tracking-[-0.5px] text-[#374151]">접수일</div>
                    <div className="font-medium text-[14px] leading-[17px] tracking-[-0.5px] text-[#374151]">상세보기</div>
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
                                className="w-full min-h-[73px] py-[16px] border-b border-[#F3F4F6] grid grid-cols-5 items-center px-[24px]"
                            >
                                <div className="font-normal text-[14px] leading-[17px] tracking-[-0.5px] text-[#111827] truncate pr-4">
                                    {report.title}
                                </div>
                                <div className="flex flex-col pr-4">
                                    <p className="font-normal text-[14px] leading-[17px] tracking-[-0.5px] text-[#4B5563] truncate">
                                        {report.content}
                                    </p>
                                </div>
                                <div className="font-normal text-[14px] leading-[17px] tracking-[-0.5px] text-[#4B5563] truncate pr-4">
                                    {report.reporter_name || '-'}
                                </div>
                                <div className="font-normal text-[14px] leading-[17px] tracking-[-0.5px] text-[#4B5563]">
                                    {report.created_at ? report.created_at.split('T')[0] : '-'}
                                </div>
                                <div>
                                    <button
                                        className="w-[80px] h-[28px] bg-[#2563EB] hover:bg-[#1D4ED8] text-[#FFFFFF] font-normal text-[14px] leading-[17px] tracking-[-0.5px] rounded-[4px] flex items-center justify-center transition-colors"
                                        onClick={() => {
                                            alert(`"${report.title}" 제보 상세 정보를 확인합니다.`);
                                        }}
                                    >
                                        상세보기
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
