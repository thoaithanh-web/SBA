# Requirement traceability

Đối chiếu SBA301 Assignment 01 Student Guide hiện có trong workspace. Không đưa PDF vào repo.

| ID | Yêu cầu | Implementation | Verification/evidence |
| --- | --- | --- | --- |
| R01 | ReactJS + Vite, tên StudentName_ClassCode | `ass1/LamThoaiThanh_SE1910`, package metadata hợp lệ npm | `npm ci`, `npm run build` |
| R02 | Login page | `pages/LoginPage.jsx` | auth.spec: empty/wrong/valid; 01-login.png |
| R03 | Admin/Admin -> admin page | `context/AuthContext.jsx`, ProtectedLayout | auth.spec: deep link, refresh, logout |
| R04 | Logo tạo bằng AI | `public/fu-news-logo.png`, Brand | AI_USAGE.md; login/sidebar screenshots |
| R05 | Header/master layout | `layouts/AdminLayout.jsx` | workspace.spec: desktop/mobile |
| R06 | Dashboard/Category/News/Users/Settings | Route table + sidebar | auth.spec navigation/history; screenshots 02–06 |
| R07 | Category CRUD + Search | CategoryPage/EntityPage, newsStore | crud.spec + validation.spec |
| R08 | News CRUD + Search | NewsPage/EntityPage/ArticlePreview | crud.spec: linked author/category, preview, persistence |
| R09 | User CRUD + Search | UsersPage/EntityPage | crud.spec: role/status/edit/delete; validation.spec |
| R10 | Create/Update dialog | EntityDialog | crud.spec: prefill/reset/cancel; 07-article-dialog.png |
| R11 | Delete confirmation | ConfirmDialog | crud.spec: cancel and confirm for all 3 entities |
| R12 | Data model hợp lý | seed/newsStore/NewsContext | relationship validation, unique names, immutable updates, localStorage |

## Rubric evidence

| Tiêu chí | Điểm tối đa trong guide | Hồ sơ |
| --- | --- | --- |
| Problem Understanding | 1.0 | Requirements + model/rules trong README |
| Solution Design & Reasoning | 1.5 | ARCHITECTURE.md, 6 decision records |
| Implementation | 2.0 | Source chạy được, screenshots |
| Testing & Verification | 1.5 | tests/, TEST_MATRIX.md |
| Debugging & Problem Solving | 1.5 | DEBUG_LOG.md từ lỗi thực tế |
| Code Explanation | 1.0 | DEMO_GUIDE.md; sinh viên cần tự demo |
| Modification/Transfer | 1.0 | Bài thực hành trong DEMO_GUIDE.md; chưa ghi là sinh viên đã làm |
| AI Usage & Engineering | 0.5 | AI_USAGE.md và lịch sử Git |

Các liên kết là bằng chứng triển khai/kiểm tra của tác nhân; điểm và năng lực giải thích/thay đổi phải do giảng viên đánh giá. Template Bootstrap Dashboard là lựa chọn hiện tại vì chưa có template riêng được cung cấp; đối chiếu lại nếu lớp có tài nguyên bắt buộc khác.
