import { createBrowserRouter, Navigate } from 'react-router-dom'

// 사용자 페이지
import { QRLandingPage } from '@/features/user/pages/qrlandingPage'
import { ArticleDetailWrapper } from '@/features/user/pages/ArticleDetailPageWrapper'

// 관리자 페이지
import { LoginPage } from '@/features/admin/pages/LoginPage'
import { IssueList } from '@/features/admin/pages/IssueList'
import { IssueCreate } from '@/features/admin/pages/IssueCreate'
import { IssueEdit } from '@/features/admin/pages/IssueEdit'
import { ProtectedRoute } from '@/features/admin/components/ProtectedRoute'
import { AdminLayout } from '@/shared/components/Layout/AdminLayout'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/admin/login" replace />,
  },
  {
    path: '/a/:paperId',
    element: <QRLandingPage />,
  },
  {
    path: '/article/:articleId',
    element: <ArticleDetailWrapper />,
  },
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
