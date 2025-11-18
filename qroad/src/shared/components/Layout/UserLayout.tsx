import { Outlet } from 'react-router-dom'

export const UserLayout = () => {
  return (
    <div className="mobile:max-w-[420px] mx-auto bg-gray-50 min-h-screen">
      <header className="sticky top-0 bg-white border-b shadow-sm z-10">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-800">QRoad</h1>
        </div>
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  )
}
