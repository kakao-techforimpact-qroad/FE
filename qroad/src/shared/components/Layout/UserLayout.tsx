import { Outlet } from 'react-router-dom'
import { BrandLogo } from '@/shared/components/BrandLogo'

export const UserLayout = () => {
  return (
    <div className="mobile:max-w-[420px] mx-auto bg-gray-50 min-h-screen">
      <header className="sticky top-0 bg-white border-b shadow-sm z-10">
        <div className="p-4">
          <BrandLogo className="h-8 sm:h-9 md:h-10 w-auto max-w-[170px] sm:max-w-[190px] md:max-w-[220px]" />
        </div>
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  )
}
