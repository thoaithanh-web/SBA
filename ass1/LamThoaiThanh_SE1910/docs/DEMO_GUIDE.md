# Demo và tự giải thích

Đăng nhập `Admin/Admin`. Đây là checklist luyện tập; phần sinh viên tự giải thích và thay đổi chưa được kiểm chứng bởi tác nhân.

## Luồng demo 8–10 phút

1. Từ project folder chạy `npm ci`, `npm run dev`; giải thích package.json, index.html, main.jsx, App.jsx.
2. Submit rỗng, nhập sai, rồi Admin/Admin. Mở deep link `/news?status=0` khi chưa login để xem route guard.
3. Dashboard: chỉ source data tạo ra total/published/category/user counts, không phải số hard-code.
4. Category: tạo một category không liên kết, search, edit, cancel delete, confirm delete.
5. User: tạo contributor mới, đổi role/status, search username. Chưa có article thì xóa được.
6. News: tạo bài liên kết category/author; nhập tags; preview; edit Draft -> Published; refresh để chứng minh persistence.
7. Thử xóa category hoặc author đang có bài -> bị chặn. Xóa article -> xóa bản ghi liên quan nếu không còn liên kết.
8. Settings: lưu publication/tagline, quay dashboard kiểm tra. Restore demo có confirmation, Cancel giữ dữ liệu.
9. Mở responsive viewport, mobile menu, dialog; dùng Tab/Escape.
10. Sign out -> vào URL admin vẫn về login. Trình bày test matrix và AI usage rõ ràng.

## Mở file và trace

Với mỗi file, trả lời Purpose -> Input -> Trigger -> Transform -> Output.

- `context/AuthContext.jsx`: credential đi vào đâu? Vì sao session không ghi password? Logout tác động gì?
- `App.jsx`: ProtectedLayout kiểm tra gì? Deep link được lưu ở đâu?
- `pages/CategoryPage.jsx`: field/column config mô tả gì? Vì sao dùng lại EntityPage?
- `pages/EntityPage.jsx`: ai giữ editor/deleting/preview? Keyword có thay source records không?
- `components/EntityDialog.jsx`: Create vs Edit khởi tạo thế nào? Vì sao modal được unmount khi đóng? Khi validation fail thì sao?
- `services/newsStore.js`: category/user uniqueness kiểm tra ra sao? map/filter nào tạo state mới? Tại sao persist trước setData?
- `context/NewsContext.jsx`: ai được gọi save/remove? Error được hiển thị ở đâu? Vì sao không đặt CRUD ở App?
- `pages/NewsPage.jsx`: categoryId/createdBy tham chiếu dữ liệu nào? Nội dung được render như text hay HTML?
- `tests/crud.spec.js`: hành vi observable nào được assert? Test có phụ thuộc thứ tự không?

## Transfer task để sinh viên tự làm

Chọn một bài, tự sửa và commit sau khi hiểu:

1. Thêm tìm category theo description: sửa searchFields, placeholder và thêm test normal/no-result.
2. Thêm giới hạn article title tối thiểu 5 ký tự: sửa service, message và test 4/5 ký tự; không chỉ sửa maxLength trên input.
3. Thêm filter role Admin/Staff cho Users: xác định URL parameter, derived filter và test kết hợp search/status.

Trước khi code, ghi affected files, input/output, regression cases. Sau khi sửa chạy build/test, ghi commit và evidence trong AI_USAGE.md. Không nới assertion để làm test xanh.
