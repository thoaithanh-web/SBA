import axios from "axios";
import type { Orchid, OrchidDraft } from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/orchids",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export const getOrchids = (signal?: AbortSignal) =>
  api.get<Orchid[]>("", { signal });
export const getOrchid = (id: string | number, signal?: AbortSignal) =>
  api.get<Orchid>(`/${id}`, { signal });
export const createOrchid = (orchid: OrchidDraft) =>
  api.post<Orchid>("", orchid);
export const updateOrchid = (id: number, orchid: OrchidDraft) =>
  api.put<Orchid>(`/${id}`, orchid);
export const deleteOrchid = (id: number) => api.delete(`/${id}`);

export function requestError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 404)
      return "Không tìm thấy hoa lan này. Có thể dữ liệu đã bị xóa.";
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (!error.response)
      return "Không thể kết nối đến máy chủ. Kiểm tra backend và kết nối rồi thử lại.";
    return `Yêu cầu không thành công (HTTP ${error.response.status}). Vui lòng thử lại.`;
  }
  return "Đã có lỗi xảy ra. Vui lòng thử lại.";
}
