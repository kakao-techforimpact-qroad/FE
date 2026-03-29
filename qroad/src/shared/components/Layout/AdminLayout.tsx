import { History, PlusCircle, MessageCircle, ChevronDown, User as UserIcon } from 'lucide-react';
import { useLogout } from '@/hooks/admin/useAuth';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

export const AdminLayout = () => {
  const logoutMutation = useLogout();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      logoutMutation.mutate();
    }
  };

  const menuItems = [
    {
      icon: History,
      label: '발행 이력',
      path: '/admin/issues',
      description: '발행된 모든 신문 관리'
    },
    {
      icon: PlusCircle,
      label: 'QR 발행',
      path: '/admin/issues/create',
      description: '새로운 QR 발행'
    },
    {
      icon: MessageCircle,
      label: '제보 확인',
      path: '/admin/reports', // Assume reports path, if not exists, user can update later
      description: '구독자 제보 내용 확인'
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-['Inter'] relative w-full overflow-hidden">
      
      {/* Header */}
      <header className="absolute w-full h-[65px] left-0 top-0 bg-[#FFFFFF] border-b border-[#E5E7EB] z-50">
        <div className="flex items-center justify-between h-full px-6">
          {/* Logo Title */}
          <div className="flex items-center">
            <h1 className="font-semibold text-[20px] leading-[28px] tracking-[-0.5px] text-[#111827]">
              QRoad Admin
            </h1>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogout} title="로그아웃">
            <div className="w-8 h-8 rounded-full bg-[#E5E7EB] flex items-center justify-center overflow-hidden border border-[#D1D5DB]">
              <UserIcon className="w-5 h-5 text-[#9CA3AF]" />
            </div>
            <span className="font-normal text-[14px] leading-[20px] tracking-[-0.5px] text-[#374151]">
              관리자
            </span>
            <ChevronDown className="w-3 h-3 text-[#9CA3AF] ml-1" />
          </div>
        </div>
      </header>

      {/* Body Area */}
      <div className="absolute w-full top-[65px] bottom-0 flex">
        
        {/* Sidebar Nav */}
        <nav className="w-[320px] h-full bg-[#FFFFFF] flex-shrink-0">
          <div className="w-[271px] ml-[24px] mt-[24px] flex flex-col gap-2">
            
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <div
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-[271px] h-[72px] rounded-[8px] flex relative cursor-pointer group transition-colors ${
                    active ? 'bg-[#EFF6FF]' : 'hover:bg-[#F3F4F6]'
                  }`}
                >
                  <div className="absolute left-[16px] top-[16px] flex items-start gap-3">
                    <div className="w-4 h-6 flex items-center justify-center mt-1">
                      <Icon className={`w-4 h-4 ${active ? 'text-[#3B82F6]' : 'text-[#6B7280]'}`} />
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-medium text-[16px] leading-[20px] tracking-[-0.5px] ${
                        active ? 'text-[#1D4ED8]' : 'text-[#374151]'
                      }`}>
                        {item.label}
                      </span>
                      <span className={`mt-1 font-normal text-[12px] leading-[15px] tracking-[-0.5px] ${
                        active ? 'text-[#2563EB] opacity-70' : 'text-[#6B7280]'
                      }`}>
                        {item.description}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 h-full overflow-auto relative bg-[#F9FAFB]">
          <Outlet />
        </main>
      </div>

    </div>
  );
};
