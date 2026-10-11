# Test matrix

Môi trường kiểm tra: Windows, Node 22.14.0, npm 10.9.2, Playwright Chromium; desktop 1440×1000, mobile 390×844. GitHub Actions chạy lại trên Ubuntu với Node 22.

Các case bên dưới được nhóm thành browser tests trong `tests/`. PASS chỉ ghi cho hành vi có assertion hoặc ảnh kiểm tra trực tiếp; phần phỏng vấn/thay đổi của sinh viên chưa được đánh dấu hoàn thành.

| ID | Nhóm | Thao tác/đầu vào | Expected và actual đã kiểm tra | Test |
| --- | --- | --- | --- | --- |
| T01 | Login | Submit rỗng | Chặn login, hiện validation | auth.spec |
| T02 | Login | Admin/sai password | Không vào admin, có error | auth.spec |
| T03 | Login | Admin/Admin | Vào dashboard hoặc deep link đang chờ | auth.spec |
| T04 | Auth | Refresh sau login | Session tab giữ nguyên | auth.spec |
| T05 | Auth | Logout rồi truy cập admin URL | Về login, session key đã xóa | auth.spec |
| T06 | Layout | Đổi đủ 5 menu, Back, URL lạ | Đúng view/history/NotFound | auth.spec |
| T07 | Category | Read/Create hợp lệ | Bản ghi mới trong table | crud.spec |
| T08 | Category | Tên rỗng/trùng khác case | Không tạo; message chính xác | validation.spec |
| T09 | Category | Edit name/status | Đúng id thay đổi, refresh vẫn giữ | crud.spec |
| T10 | Category | Delete -> Cancel | Bản ghi còn | crud.spec |
| T11 | Category | Delete -> Confirm bản ghi không liên kết | Bản ghi mất, refresh không trở lại | crud.spec |
| T12 | Category | Search trim + uppercase, miss, clear | Filter đúng, source không mất | crud/validation.spec |
| T13 | News | Create category/author rồi tạo bài | News gắn đúng hai foreign keys | crud.spec |
| T14 | News | Title/content/category thiếu | Chặn save, error theo field | validation.spec |
| T15 | News | Preview | Title/content/author/category hiển thị; duplicate tags bị loại | crud.spec |
| T16 | News | Edit title và Draft -> Published | Đúng record; sau refresh vẫn Published | crud.spec |
| T17 | News | Delete -> Cancel/Confirm | Cancel giữ, Confirm xóa đúng bài | crud.spec |
| T18 | News | Search hit/miss, status + category | Kết quả và count đúng, có empty UI | crud/workspace/validation.spec |
| T19 | User | Read/Create | Record mới, Staff/Active mặc định | crud.spec |
| T20 | User | Rỗng, username Admin trùng, email lỗi | Chặn save, message đúng | validation.spec |
| T21 | User | Edit name/role/status | Đúng record, Admin/Inactive, giữ qua refresh | crud.spec |
| T22 | User | Delete -> Cancel/Confirm | Cancel giữ, Confirm xóa user chưa liên kết | crud.spec |
| T23 | User | Search username khác case/miss/clear | Filter đúng và không mất source | crud/validation.spec |
| T24 | Integrity | Xóa category/author đang có bài | Chặn xóa, giữ dialog và có message | validation.spec |
| T25 | Admin | Thử đổi định danh/role/status hoặc delete | Fields/delete bị disable | validation.spec |
| T26 | Modal | Edit A, close, Edit B, Create | Prefill đúng; Create rỗng | crud.spec |
| T27 | Settings | Rỗng/lưu/refresh/dashboard | Validation hoặc publication/tagline mới | workspace.spec |
| T28 | Reset | Restore -> Cancel/Confirm | Cancel giữ; Confirm về seed | workspace.spec |
| T29 | Storage | JSON không đọc được | Warning + seed; save mới thay snapshot hợp lệ | workspace.spec |
| T30 | Storage | Giả lập quota error | Dialog giữ, source data không đổi | validation.spec |
| T31 | Input | Category chứa markup | Render text, không tạo img/onerror element | validation.spec |
| T32 | Mobile | Menu, open modal, Escape | Menu đóng khi navigate, focus vào field và về trigger | workspace.spec |
| T33 | Visual | Desktop/mobile routes | Không horizontal overflow của document; không pageerror | workspace.spec |
| T34 | Empty collection | Không có categories/news | Dashboard count 0, empty state dùng được, không tạo news với category không tồn tại | workspace.spec |

## Lệnh tái lập

```sh
npm ci
npx playwright install chromium
npm run format:check
npm run build
npm test
```

Kết quả chạy cuối được tổng hợp trong `VERIFICATION.md`. Screenshots đã chụp từ ứng dụng thật: `evidence/01-login.png` đến `08-mobile.png`. Screenshot là bằng chứng giao diện; assertions trong browser tests mới kiểm chứng behavior/state.

## Phần chưa được kiểm chứng tự động

- Phỏng vấn, sửa code trực tiếp và transfer task do sinh viên tự thực hiện.
- Template riêng của giảng viên chưa được cung cấp để đối chiếu.
- Backend, database thật, phân quyền production, nhiều người dùng đồng thời không thuộc implementation này.
