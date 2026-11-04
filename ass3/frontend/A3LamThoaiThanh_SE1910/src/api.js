// Author: Lam Thoai Thanh - CE190169
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8083/api",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("hotel-token");
  if (token && !config.url.startsWith("/public/") && !config.url.startsWith("/auth/")) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

api.interceptors.response.use(undefined, (error) => {
  if (error.response?.status === 401 && error.config?.headers?.Authorization &&
      error.config.headers.Authorization === "Bearer " + sessionStorage.getItem("hotel-token")) {
    sessionStorage.removeItem("hotel-token");
    sessionStorage.removeItem("hotel-user");
    window.dispatchEvent(new Event("hotel-session-ended"));
  }
  return Promise.reject(error);
});

export function message(error) {
  const { data, status } = error.response || {};
  const fields = Object.entries(data?.fieldErrors || {}).map(([key, value]) => key + ": " + value);
  if (fields.length) return fields.join(" · ");
  if (data?.message) return data.message;
  if (status === 403) return "Bạn không có quyền thực hiện thao tác này.";
  if (status === 401) return "Phiên đăng nhập đã hết hạn.";
  return status ? "Yêu cầu thất bại (" + status + ")." : "Không kết nối được với backend.";
}

export const money = (value) => new Intl.NumberFormat("vi-VN", {
  style: "currency", currency: "VND",
}).format(value);
export const today = () => new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "2-digit", day: "2-digit",
}).format(new Date());
