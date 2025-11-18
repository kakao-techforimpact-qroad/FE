import { ReactNode } from 'react'
import { useLocation, useNavigate, Outlet } from 'react-router-dom'
import { cn } from '@/shared/utils/cn'
import { FileText, PlusCircle, LogOut } from 'lucide-react'

const navigation = [
  { name: 'Article History', href: '/admin/articles', icon: FileText },
  { name: 'New Article', href: '/admin/publish', icon: PlusCircle },
]

export const AdminLayout = ({ children }: { children?: ReactNode }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <aside 
        className="fixed left-0 top-0 h-screen w-[260px] flex flex-col"
        style={{
          background: 'linear-gradient(180deg, #1a0e24 0%, #12091a 100%)',
        }}
      >
        <div className="pt-7 pb-6 px-6">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, rgba(124, 58, 237, 0.1) 70%)',
                boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)',
              }}
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600" />
            </div>
          </div>
          <h1 className="text-xl font-bold" style={{ color: '#f5f3f7' }}>
            QR Admin
          </h1>
          <p className="text-sm" style={{ color: '#a78bba' }}>
            Management
          </p>
        </div>

        <div className="h-px mx-5" style={{ backgroundColor: '#3d2952' }} />

        <nav className="flex-1 px-5 py-7 space-y-3">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            const Icon = item.icon
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.href)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 text-left',
                  isActive
                    ? 'shadow-lg'
                    : 'hover:bg-[#2d1b3d]'
                )}
                style={
                  isActive
                    ? {
                        backgroundColor: '#7c3aed',
                        color: '#ffffff',
                        boxShadow: '0 4px 16px rgba(124, 58, 237, 0.4)',
                      }
                    : { color: '#f5f3f7' }
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item.name}</span>
              </button>
            )
          })}
        </nav>

        <div className="p-5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all duration-300 hover:shadow-md text-left"
            style={{
              backgroundColor: '#1a0e24',
              borderColor: '#3d2952',
              color: '#f5f3f7',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#5b21b6'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(124, 58, 237, 0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#3d2952'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <main 
        className="flex-1 ml-[260px] overflow-y-auto"
        style={{
          background: 'linear-gradient(180deg, #12091a 0%, #1e112b 100%)',
        }}
      >
        <div className="min-h-full p-8">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  )
}
