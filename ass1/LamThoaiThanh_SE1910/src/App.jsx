import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import AdminLayout from './layouts/AdminLayout'

function ProtectedLayout() {
  const { authenticated } = useAuth()
  const location = useLocation()
  return authenticated ? <AdminLayout /> : <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
}

export default function App() {
  return <AuthProvider><Routes><Route path="/login" element={<LoginPage />} /><Route element={<ProtectedLayout />}><Route index element={<Navigate to="/dashboard" replace />} />{['dashboard', 'categories', 'news', 'users', 'settings'].map(page => <Route key={page} path={page} element={<h1>{page}</h1>} />)}<Route path="*" element={<h1>Page not found</h1>} /></Route></Routes></AuthProvider>
}
