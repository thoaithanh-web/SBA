# Verification · 12/10/2026

Môi trường: Windows, Node 22.14.0, npm 10.9.2, Playwright Chromium. Tests chạy với Vite production preview.

| Nhóm | Expected/actual | Kết quả |
| --- | --- | --- |
| Build | Vite tạo bundle thành công | PASS |
| Format | Prettier check sạch | PASS |
| Gallery | 8 cards, tên riêng, ảnh load được, không pageerror | PASS |
| Modal | Chọn A rồi B đúng nội dung, Close/Escape đóng | PASS |
| Responsive | Navbar mở được, document không overflow ở 390px | PASS |
| Service | TTL 29999ms hit, 30000ms miss, force miss, snapshot clone | PASS |
| Race | Aborted response cũ không ghi đè cache mới | PASS |
| Loading | Có spinner khi response bị trì hoãn | PASS |
| HTTP/error | 404, network error, JSON/schema lỗi được báo; retry phục hồi | PASS |
| Empty/filter | Mảng rỗng khác no-result; filter không tăng request count | PASS |

Tổng: 4 service tests + 8 browser tests, không bỏ qua test. npm audit sau khi cài đặt báo 0 vulnerabilities.

## Evidence và debug

Ảnh `01-gallery.png`, `02-detail.png`, `03-mobile.png` được Playwright chụp trực tiếp. `04-http-error.png` chứng minh lỗi 404; `network.json` lưu method/path/status/content type/record count của response 200 thật. Cố tình trả JSON lỗi và mảng rỗng bằng route interception để kiểm chứng các nhánh lỗi/empty, không chỉnh source cuối.

Lỗi phát hiện: test chọn Close bị trùng tên giữa nút X và footer → scope locator vào modal footer. Kiểm tra ảnh ngay sau card mount đôi lúc ảnh chưa load → dùng expect.poll chờ điều kiện ảnh, vẫn giữ assertion naturalWidth>0. Sau sửa các test đều PASS. Axios 1.16 ban đầu bị npm audit cảnh báo → cập nhật 1.20.0; audit về 0.

Human Gate, vấn đáp và transfer task của sinh viên chưa được kiểm chứng bằng các test này.
