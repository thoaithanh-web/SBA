// Author: Lam Thoai Thanh - CE190169
import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    api
      .get("/auth/me", { signal: controller.signal })
      .then((r) => {
        if (!controller.signal.aborted) setUser(r.data);
      })
      .catch(() => {})
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    const expired = () => setUser(null);
    window.addEventListener("session-expired", expired);
    return () => {
      controller.abort();
      window.removeEventListener("session-expired", expired);
    };
  }, []);
  async function login(email, password) {
    const r = await api.post("/auth/login", { email, password });
    setUser(r.data);
    return r.data;
  }
  async function logout() {
    await api.post("/auth/logout");
    setUser(null);
  }
  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  return useContext(AuthContext);
}
