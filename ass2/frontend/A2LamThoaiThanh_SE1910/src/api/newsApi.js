// Author: Lam Thoai Thanh - CE190169
import api from "./client";
export function listRecords(
  resource,
  { keyword = "", page = 0, size = 10, signal } = {},
) {
  return api.get("/" + resource, {
    params: { keyword: keyword || undefined, page, size },
    signal,
  });
}
export function getRecord(resource, id, signal) {
  return api.get(`/${resource}/${id}`, { signal });
}
export function createRecord(resource, data) {
  return api.post("/" + resource, data);
}
export function updateRecord(resource, id, data) {
  return api.put(`/${resource}/${id}`, data);
}
export function deleteRecord(resource, id) {
  return api.delete(`/${resource}/${id}`);
}
export async function allCategories(signal) {
  const items = [];
  let page = 0,
    last = false;
  while (!last) {
    const r = await listRecords("categories", { page, size: 100, signal });
    items.push(...r.data.content);
    last = r.data.last;
    page++;
  }
  return items;
}
