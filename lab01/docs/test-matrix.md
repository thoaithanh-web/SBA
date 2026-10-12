# Verification · 12/10/2026

Môi trường: Windows, Node 22.14.0, npm 10.9.2, Playwright Chromium. Tests chạy với Vite production preview.

| Nhóm | Expected/actual | Kết quả |
| --- | --- | --- |
| Build | Vite tạo bundle thành công | PASS |
| Format | Prettier check sạch | PASS |
| Gallery | 8 cards, tên riêng, ảnh load được, không pageerror | PASS |
| Modal | Chọn A rồi B đúng nội dung, Close/Escape đóng | PASS |
| Responsive | Navbar mở được, document không overflow ở 390px | PASS |


Tổng: 3 browser tests, không bỏ qua test. npm audit sau khi cài đặt báo 0 vulnerabilities.

## Evidence và debug

Ảnh `01-gallery.png`, `02-detail.png`, `03-mobile.png` được Playwright chụp trực tiếp. Ảnh detail được chụp trước khi đóng modal; ảnh mobile ghi lại navbar đã mở.

Lỗi phát hiện: test chọn Close bị trùng tên giữa nút X và footer → scope locator vào modal footer. Kiểm tra ảnh ngay sau card mount đôi lúc ảnh chưa load → dùng expect.poll chờ điều kiện ảnh, vẫn giữ assertion naturalWidth>0. Sau sửa các test đều PASS.

Human Gate, vấn đáp và transfer task của sinh viên chưa được kiểm chứng bằng các test này.
