import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AdminLayout } from '@/shared/components/Layout/AdminLayout'

// User Pages
import { QRLanding } from '@/features/user/pages/qrlandingPage'
import { ArticleDetailWrapper } from '@/features/user/pages/ArticleDetailPageWrapper'

// Admin Pages
import { AdminDashboard } from '@/features/admin/pages/AdminDashboard'
import { ArticleManagePage } from '@/features/admin/pages/ArticleManagePage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/admin" replace />,
  },
  // 사용자 페이지
  {
    path: '/a/:id',
    element: <QRLanding />,
  },
  {
    path: '/a/article/:articleId',
    element: <ArticleDetailWrapper />,
  },
  // 관리자 페이지
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: 'articles',
        element: <ArticleManagePage />,
      },
    ],
  },
])
