export const AdminDashboard = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">관리자 대시보드</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">총 기사 수</h3>
          <p className="text-3xl font-bold text-blue-600">24</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">생성된 QR 코드</h3>
          <p className="text-3xl font-bold text-green-600">5</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">오늘 조회수</h3>
          <p className="text-3xl font-bold text-purple-600">128</p>
        </div>
      </div>
    </div>
  )
}
