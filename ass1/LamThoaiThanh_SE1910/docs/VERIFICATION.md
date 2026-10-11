# Verification

Ngày kiểm tra: 11/10/2026. Môi trường: Windows, Node 22.14.0, npm 10.9.2, Chromium của Playwright.

| Kiểm tra | Kết quả |
| --- | --- |
| `npm run format:check` | PASS |
| `npm run build` | PASS |
| `npm test` | 20/20 PASS, 27.8 giây |
| `npm audit --omit=dev` | 0 vulnerabilities |
| Kiểm tra comments trong JavaScript, JSX, CSS và HTML | 33 files, không có code comment |
| `git diff --check` | PASS |

Browser tests kiểm tra đăng nhập, protected routes, CRUD ba nhóm dữ liệu, validation, quan hệ dữ liệu, persistence, lỗi storage, empty states, settings, mobile và keyboard focus. Chi tiết trong [TEST_MATRIX.md](TEST_MATRIX.md).

Ảnh từ ứng dụng thật nằm trong `evidence/`: login, dashboard, categories, news, users, settings, article dialog và mobile. Đã xem trực tiếp ảnh login, dashboard và mobile để đối chiếu bố cục.

GitHub Actions tự chạy lại format, build và browser tests sau mỗi lần push. Kết quả CI được công bố tại [Actions](https://github.com/thoaithanh-web/SBA/actions).

Các kết quả trên không thay thế phần sinh viên tự giải thích mã nguồn, demo và thực hiện transfer task trong [DEMO_GUIDE.md](DEMO_GUIDE.md).
