// Author: Lam Thoai Thanh - CE190169
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import EditorialLayout from "./layouts/EditorialLayout";
import PublicNews from "./pages/PublicNews";
import Login from "./pages/Login";
import ManagementPage from "./pages/ManagementPage";
import Profile from "./pages/Profile";
function Protected({ role }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading)
    return (
      <main className="public-shell">
        <p role="status">Checking your session…</p>
      </main>
    );
  if (!user)
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  if (role && user.accountRole !== role)
    return (
      <Navigate
        to={user.accountRole === 1 ? "/workspace/accounts" : "/workspace/news"}
        replace
      />
    );
  return <Outlet />;
}
export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<PublicNews />} />
        <Route path="/news/:id" element={<PublicNews detail />} />
        <Route path="/login" element={<Login />} />
        <Route element={<Protected />}>
          <Route element={<EditorialLayout />}>
            <Route
              path="/workspace"
              element={<Navigate to="/workspace/news" replace />}
            />
            <Route element={<Protected role={1} />}>
              <Route
                path="/workspace/accounts"
                element={<ManagementPage resource="accounts" />}
              />
            </Route>
            <Route element={<Protected role={2} />}>
              <Route
                path="/workspace/categories"
                element={<ManagementPage resource="categories" />}
              />
              <Route
                path="/workspace/news"
                element={<ManagementPage resource="news" />}
              />
              <Route
                path="/workspace/history"
                element={<ManagementPage resource="news/history" history />}
              />
              <Route path="/workspace/profile" element={<Profile />} />
            </Route>
          </Route>
        </Route>
        <Route
          path="*"
          element={
            <main className="public-shell">
              <h1>Page not found</h1>
              <a href="/">Back to campus news</a>
            </main>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
