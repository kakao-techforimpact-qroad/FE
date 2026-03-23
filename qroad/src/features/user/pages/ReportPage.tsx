import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '@/api/user';
import { ChevronLeft, Info, AlertCircle } from 'lucide-react';

export function ReportPage() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [reporterContact, setReporterContact] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!title.trim()) {
            alert('제보 제목을 입력해주세요.');
            return;
        }
        if (!reporterContact.trim()) {
            alert('연락처(이름/전화번호)를 입력해주세요.');
            return;
        }
        if (!content.trim()) {
            alert('제보 내용을 입력해주세요.');
            return;
        }

        try {
            setIsSubmitting(true);
            await userApi.createReport({
                title,
                content,
                reporterContact,
            });
            alert('제보가 등록되었습니다.');
            navigate(-1);
        } catch (error) {
            alert('제보 등록에 실패했습니다. 다시 시도해주세요.');
            console.error('Report submission failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#F9FAFB] flex flex-col items-center font-['Noto_Sans_KR']">
            {/* Mobile Wrapper */}
            <div className="w-full max-w-[375px] bg-white relative min-h-screen border-x border-[#E5E7EB]">
                
                {/* Header */}
                <header className="w-full h-[57px] bg-white border-b border-[#F3F4F6] flex items-center px-4 sticky top-0 z-50">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="w-10 h-10 flex items-center justify-center -ml-2 active:scale-95 transition-transform"
                    >
                        <ChevronLeft className="w-6 h-6 text-[#111827]" />
                    </button>
                    <h1 className="flex-1 text-center text-[16px] font-normal text-[#111827] pr-8 tracking-[-0.5px]">
                        제보하기
                    </h1>
                </header>

                {/* Top Gradient Area */}
                <div className="w-full bg-gradient-to-b from-[#EFF6FF] to-[#FFFFFF] px-5 py-6">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center shrink-0">
                            <AlertCircle className="w-[18px] h-[18px] text-white" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h2 className="text-[20px] leading-[28px] text-[#111827] tracking-[-0.5px]">
                                지역 이슈를 알려주세요
                            </h2>
                            <p className="text-[14px] leading-[23px] text-[#4B5563] tracking-[-0.5px] mt-1">
                                보내주신 내용은 해당 지역언론이<br/>검토할 수 있습니다.
                            </p>
                        </div>
                    </div>

                    <div className="w-full bg-[#DBEAFE] rounded-[8px] px-4 py-3 mt-6">
                        <p className="text-[12px] leading-[20px] text-[#1E3A8A] tracking-[-0.5px]">
                            QRoad는 지역신문을 더 쉽고 편리하게 볼 수 있도록 돕는 서비스입니다.
                        </p>
                    </div>
                </div>

                {/* Form Area */}
                <div className="w-full px-5 py-6 flex flex-col gap-6">
                    
                    {/* Title Input */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[14px] leading-[17px] text-[#111827] flex gap-1 tracking-[-0.5px]">
                            제보 제목 <span className="text-[#EF4444]">*</span>
                        </label>
                        <input 
                            type="text" 
                            placeholder="제보 제목을 입력해주세요"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full h-[46px] px-4 bg-white border border-[#D1D5DB] rounded-[12px] text-[14px] text-[#111827] placeholder:text-gray-400 focus:outline-none focus:border-[#2563EB] transition-colors"
                        />
                    </div>

                    {/* Name/Contact Input */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[14px] leading-[17px] text-[#111827] flex gap-1 tracking-[-0.5px]">
                            제보자 연락처 <span className="text-[#EF4444]">*</span>
                        </label>
                        <input 
                            type="text" 
                            placeholder="이름이나 전화번호를 입력해주세요"
                            value={reporterContact}
                            onChange={(e) => setReporterContact(e.target.value)}
                            className="w-full h-[46px] px-4 bg-white border border-[#D1D5DB] rounded-[12px] text-[14px] text-[#111827] placeholder:text-gray-400 focus:outline-none focus:border-[#2563EB] transition-colors"
                        />
                        <p className="text-[12px] leading-[20px] text-[#6B7280] tracking-[-0.5px]">
                            정확한 확인을 위해 연락 가능한 정보를 남겨주세요
                        </p>
                    </div>

                    {/* Content Input */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[14px] leading-[17px] text-[#111827] flex gap-1 tracking-[-0.5px]">
                            제보 내용 <span className="text-[#EF4444]">*</span>
                        </label>
                        <textarea 
                            placeholder="전화번호와 함께 제보 내용을 작성해주세요"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full h-[146px] p-4 bg-white border border-[#D1D5DB] rounded-[12px] text-[14px] text-[#111827] placeholder:text-gray-400 resize-none focus:outline-none focus:border-[#2563EB] transition-colors"
                        />
                        <p className="text-[12px] leading-[20px] text-[#6B7280] tracking-[-0.5px]">
                            연락 가능한 전화번호와 내용을 함께 적어주시면 확인에 도움이 됩니다
                        </p>
                    </div>

                </div>

                {/* Bottom Fixed Area (Relative to Wrapper) */}
                <div className="w-full px-5 pb-8 pt-4">
                    <div className="w-full bg-[#F9FAFB] rounded-[12px] p-4 flex gap-2 mb-6">
                        <Info className="w-3.5 h-3.5 text-[#4B5563] shrink-0 mt-[3px]" />
                        <p className="text-[12px] leading-[20px] text-[#374151] tracking-[-0.5px]">
                            제출된 내용은 해당 지역의 언론사에서 검토하며, QRoad 팀이 직접 처리하지 않습니다. 검토 및 반영 여부는 언론사 판단에 따라 결정될 수 있습니다.
                        </p>
                    </div>

                    <button   
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full h-[56px] bg-[#2563EB] text-white rounded-[12px] text-[16px] tracking-[-0.5px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-50 disabled:active:scale-100"
                    >
                        {isSubmitting ? '제출 중...' : '제보하기'}
                    </button>
                </div>

            </div>
        </div>
    );
}
