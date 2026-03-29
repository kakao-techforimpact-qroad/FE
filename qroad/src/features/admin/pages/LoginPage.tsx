import { useState } from 'react';
import { User, Lock, LayoutGrid } from 'lucide-react';
import { useLogin } from '@/hooks/admin/useAuth';

export const LoginPage = () => {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');

    const loginMutation = useLogin();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        loginMutation.mutate({
            loginId: loginId,
            password: password,
        });
    };

    return (
        <div className="min-h-screen w-full bg-[#F9FAFB] flex flex-col items-center justify-center font-['Inter']">
            
            <div className="w-[448px] flex flex-col items-center">
                
                {/* Header Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-[#0EA5E9] rounded-[12px] flex items-center justify-center shadow-sm">
                        <LayoutGrid className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="mt-[16px] font-semibold text-[24px] leading-[32px] text-center tracking-[-0.5px] text-[#111827]">
                        QRoad Admin
                    </h1>
                    <p className="mt-[9px] font-normal text-[14px] leading-[20px] text-center tracking-[-0.5px] text-[#4B5563]">
                        관리자 로그인
                    </p>
                </div>

                {/* Login Form Card */}
                <div className="w-full bg-[#FFFFFF] border border-[#E5E7EB] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] rounded-[16px] p-[33px]">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        
                        {/* ID Field */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="loginId" className="font-medium text-[14px] leading-[17px] tracking-[-0.5px] text-[#374151]">
                                아이디
                            </label>
                            <div className="relative w-full h-[50px]">
                                <input
                                    id="loginId"
                                    type="text"
                                    placeholder="아이디를 입력해주세요"
                                    value={loginId}
                                    onChange={(e) => setLoginId(e.target.value)}
                                    className="w-full h-full bg-[#FFFFFF] border border-[#D1D5DB] rounded-[8px] pl-4 pr-10 font-normal text-[16px] text-[#111827] tracking-[-0.5px] placeholder:text-[rgba(17,24,39,0.5)] focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] transition-colors"
                                    required
                                    disabled={loginMutation.isPending}
                                />
                                <User className="absolute right-[13px] top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="font-medium text-[14px] leading-[17px] tracking-[-0.5px] text-[#374151]">
                                비밀번호
                            </label>
                            <div className="relative w-full h-[50px]">
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="비밀번호를 입력해주세요"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-full bg-[#FFFFFF] border border-[#D1D5DB] rounded-[8px] pl-4 pr-10 font-normal text-[16px] text-[#111827] tracking-[-0.5px] placeholder:text-[rgba(17,24,39,0.5)] focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] transition-colors"
                                    required
                                    disabled={loginMutation.isPending}
                                />
                                <Lock className="absolute right-[13px] top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
                            </div>
                        </div>

                        {/* Options */}
                        <div className="flex items-center justify-between h-[20px] mt-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4 border border-[#000000] rounded-[1px] accent-[#0284C7] cursor-pointer"
                                />
                                <span className="font-normal text-[14px] leading-[20px] tracking-[-0.5px] text-[#4B5563] group-hover:text-[#374151] transition-colors">
                                    로그인 상태 유지
                                </span>
                            </label>
                            <a href="#" className="font-normal text-[14px] leading-[17px] tracking-[-0.5px] text-[#0284C7] hover:underline">
                                비밀번호 찾기
                            </a>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loginMutation.isPending}
                            className="w-full h-[48px] mt-1 bg-[#0284C7] hover:bg-[#0369A1] active:bg-[#075985] text-[#FFFFFF] rounded-[8px] font-medium text-[16px] leading-[20px] tracking-[-0.5px] flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loginMutation.isPending ? '로그인 중...' : '로그인'}
                        </button>

                    </form>
                </div>

                {/* Footer Copy */}
                <div className="mt-6 text-center">
                    <p className="font-normal text-[12px] leading-[16px] tracking-[-0.5px] text-[#6B7280]">
                        © 2024 QRoad Admin. 모든 권리 보유.
                    </p>
                </div>

            </div>
        </div>
    );
};
