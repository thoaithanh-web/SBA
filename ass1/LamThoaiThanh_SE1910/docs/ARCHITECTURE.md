# Thiết kế và state ownership

## Component tree

```text
main.jsx -> BrowserRouter -> App -> AuthProvider
  /login -> LoginPage
  ProtectedLayout -> NewsProvider -> AdminLayout
    Sidebar + Header + Outlet + Footer
    /dashboard  -> DashboardPage
    /categories -> CategoryPage -> EntityPage
    /news       -> NewsPage     -> EntityPage
    /users      -> UsersPage    -> EntityPage
    /settings   -> SettingsPage
    *           -> NotFoundPage

EntityPage
  PageHeading + status filters + search + table/empty state
  EntityDialog / ConfirmDialog / ArticlePreview
```

## Sáu quyết định thiết kế

| Quyết định | Lựa chọn và lý do | Nếu đổi yêu cầu |
| --- | --- | --- |
| Navigation | React Router; URL chứa page/search/status/category, hỗ trợ deep link và history | Thêm page bằng Route và navigation entry |
| State ownership | AuthProvider giữ login; NewsProvider giữ entities/settings; EntityPage giữ selected/modal; dialog giữ form/error | Có backend thì thay data-access và giữ phần UI |
| Persistence | Một snapshot localStorage có version; lưu thành công trước khi setData | Migration theo version hoặc chuyển REST service |
| Dialog reuse | EntityDialog dựng form từ config; 3 page giữ field/column/domain riêng | Custom form nếu một entity có interaction phức tạp hơn |
| Search | Derived value từ source records; trim/lowercase; không ghi filtered list vào state | Thêm field vào searchFields hoặc chuyển server-side search |
| Folder structure | pages, components, context, services, data, styles, utils; không gom logic vào App | Chuyển feature folders nếu quy mô tăng |

## State map

| State | Owner | Persistence |
| --- | --- | --- |
| authenticated | AuthProvider | sessionStorage `fu-news:session:v1` |
| categories/news/users/settings | NewsProvider | localStorage `fu-news:data:v1` |
| keyword/status/category | URLSearchParams trong EntityPage | URL |
| editor/deleting/preview | EntityPage | Không |
| form values/error | EntityDialog/SettingsPage | Không cho tới khi save |
| notification/warning | NewsProvider | Không |
| sidebar open | AdminLayout | Không |
| dashboard counts/filtered records | Derived, không thêm state | Tính từ source |

Auth state và data state được tách vì logout phải chặn truy cập nhưng không xóa công việc đang lưu. Provider chỉ mount khi login thành công. Password login không được ghi storage. Contributor metadata không tạo thêm credential.

## Data model

- Category: `id, name, description, status`.
- News: `id, title, content, categoryId, createdBy, status, tags[], createdAt, updatedAt`.
- User: `id, username, name, email, role, status`; login demo cố định tách khỏi metadata, không lưu contributor password.
- Settings: `publicationName, tagline`.
- Một Category có nhiều News; một User là author của nhiều News. Foreign key được kiểm tra trong service. Không có database thật.

## Create flow

New article -> editor chứa record null -> dialog khởi tạo form mới -> onChange cập nhật form -> submit -> `saveRecord` validate -> tạo UUID và snapshot mới -> `persistData` -> setData -> close dialog -> reset filters -> table và dashboard re-render -> toast.

Nếu validation hoặc storage thất bại, service throw message, dialog hiển thị error và giữ values. Không đóng modal hoặc thay source data trước khi lưu thành công.

## Update/delete/search

- Update: selected record -> prefill -> validate -> immutable map theo id -> persist -> state -> UI. `createdAt` giữ nguyên.
- Delete: selected record -> confirmation -> Cancel đóng mà không gọi remove; Confirm kiểm tra liên kết -> immutable filter -> persist -> state.
- Search: input -> URL q -> normalize -> filter source records + status/category -> table hoặc no-result. Clear search giữ các filter khác; Clear filters xóa tất cả.
- Stored JSON không hợp lệ -> seed + warning; save thành công thay snapshot unreadable. Không tự khẳng định dữ liệu hỏng đã được phục hồi nguyên vẹn.

## Boundary

Service không render UI hoặc điều hướng. Components không viết trực tiếp localStorage. AuthProvider/NewsProvider là điểm tích hợp state. Không render HTML từ user input; React hiển thị content dưới dạng text.
