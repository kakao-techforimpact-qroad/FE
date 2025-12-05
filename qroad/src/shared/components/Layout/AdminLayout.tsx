import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/shared/components/ui/button';
import { LogOut, History, PlusCircle, Menu, ChevronLeft } from 'lucide-react';
import { useLogout, useAuthStatus } from '@/hooks/admin/useAuth';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

export const AdminLayout = () => {
  const logoutMutation = useLogout();
  const { pressCompany } = useAuthStatus();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      logoutMutation.mutate();
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const menuItems = [
    {
      icon: History,
      label: '기사 이력',
      path: '/admin/issues',
      description: '발행된 모든 기사 관리'
    },
    {
      icon: PlusCircle,
      label: '기사 발행',
      path: '/admin/issues/create',
      description: '새로운 기사 발행'
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-violet-50 flex flex-col">
      {/* Top Bar - Always Visible */}
      <header className="bg-white border-b border-purple-100 shadow-sm z-40 sticky top-0">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left: Logo and Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="hover:bg-purple-50 p-2 rounded-lg transition-colors group"
              title={isSidebarOpen ? "사이드바 숨기기" : "사이드바 열기"}
            >
              <motion.div
                className="w-10 h-10 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg"
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                {isSidebarOpen ? (
                  <ChevronLeft className="w-5 h-5 text-white" />
                ) : (
                  <Menu className="w-5 h-5 text-white" />
                )}
              </motion.div>
            </button>
            <div>
              <h1 className="text-xl bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                QRoad Admin
              </h1>
              <p className="text-xs text-gray-500">관리자 페이지</p>
            </div>
          </div>

          {/* Right: User Info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-violet-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {(pressCompany || localStorage.getItem('adminId') || '관리자')?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {pressCompany || localStorage.getItem('adminId') || '관리자'}
              </span>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <AnimatePresence mode="wait">
          {isSidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 288, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="bg-white border-r border-purple-100 shadow-xl flex flex-col overflow-hidden"
            >
              {/* Menu Items */}
              <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <motion.button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-200 group ${active
                        ? 'bg-gradient-to-r from-purple-600 to-violet-600 shadow-lg shadow-purple-500/30'
                        : 'hover:bg-purple-50 border border-transparent hover:border-purple-200'
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${active ? 'bg-white/20' : 'bg-purple-100 group-hover:bg-purple-200'
                          } transition-colors`}>
                          <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-purple-600'
                            }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold ${active ? 'text-white' : 'text-gray-900'
                            }`}>
                            {item.label}
                          </h3>
                          <p className={`text-xs mt-1 ${active ? 'text-white/80' : 'text-gray-500'
                            }`}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <motion.main
          className="flex-1 overflow-auto"
          animate={{
            marginLeft: isSidebarOpen ? 0 : 0,
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};
