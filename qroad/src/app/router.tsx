import { createBrowserRouter, Navigate } from 'react-router-dom'

// User Pages
import { QRLandingPage } from '@/features/user/pages/qrlandingPage'
import { ArticleDetailWrapper } from '@/features/user/pages/ArticleDetailPageWrapper'

// Admin Pages
import { LoginPage } from '@/features/admin/pages/LoginPage'
import { IssueList } from '@/features/admin/pages/IssueList'
import { IssueCreate } from '@/features/admin/pages/IssueCreate'
import { IssueEdit } from '@/features/admin/pages/IssueEdit'
import { ProtectedRoute } from '@/features/admin/components/ProtectedRoute'
import { AdminLayout } from '@/shared/components/Layout/AdminLayout'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/a/1" replace />,
  },
  // 사용자 페이지
  {
    path: '/a/:id',
    element: <QRLandingPage />,
  },
  {
    path: '/a/article/:articleId',
    element: <ArticleDetailWrapper />,
  },
  // 관리자 페이지
  {
    path: '/admin/login',
    element: <LoginPage />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/issues" replace />,
      },
      {
        path: 'issues',
        element: <IssueList />,
      },
      {
        path: 'issues/create',
        element: <IssueCreate />,
      },
      {
        path: 'issues/:id',
        element: <IssueEdit />,
      },
    ],
  },
])

