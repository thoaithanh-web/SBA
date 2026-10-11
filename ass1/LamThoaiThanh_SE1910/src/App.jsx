import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import AdminLayout from './layouts/AdminLayout'
import { NewsProvider } from './context/NewsContext'
import DashboardPage from './pages/DashboardPage'
import CategoryPage from './pages/CategoryPage'
import NewsPage from './pages/NewsPage'
import UsersPage from './pages/UsersPage'
import SettingsPage from './pages/SettingsPage'
import NotFoundPage from './pages/NotFoundPage'

function ProtectedLayout() {
  const { authenticated } = useAuth()
  const location = useLocation()
  return authenticated ? <NewsProvider><AdminLayout /></NewsProvider> : <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="categories" element={<CategoryPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
