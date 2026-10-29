// Author: Lam Thoai Thanh - CE190169
import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8082/api",
  withCredentials: true,
  timeout: 12000,
});
api.interceptors.request.use(async (config) => {
  if (
    !["get", "head", "options"].includes((config.method || "get").toLowerCase())
  ) {
    const response = await api.get("/auth/csrf");
    config.headers[response.data.headerName] = response.data.token;
  }
  return config;
});
api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes("/auth/login") &&
      !error.config?.url?.includes("/auth/me")
    )
      window.dispatchEvent(new Event("session-expired"));
    return Promise.reject(error);
  },
);
export default api;
export function errorMessage(error) {
  return (
    error.response?.data?.message ||
    error.response?.data?.detail ||
    (error.response
      ? `Request failed (${error.response.status}). Please retry.`
      : "Cannot connect to the API. Start the backend and try again.")
  );
}
