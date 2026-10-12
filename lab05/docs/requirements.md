# Đối chiếu yêu cầu

Nguồn: SBA301 Lab05 Full-Stack SPA Step-by-Step Guide 17 trang và tài liệu cấu trúc Orchid Management do người dùng cung cấp. PDF không được đưa vào repository.

| Yêu cầu | Triển khai | Kiểm chứng |
| --- | --- | --- |
| Java 21, Spring Boot 3, Maven | backend/pom.xml, BackendApplication | Maven build/test |
| Hai project độc lập | backend/, frontend/ | Build riêng từng project |
| Controller → Service → Repository | fu.se.backend.orchids | API test và SQL integration |
| Orchid entity đủ trường | Orchid.java | JSON contract + INFORMATION_SCHEMA |
| SQL Server persistence | OrchidManagementDB.dbo.Orchid | SQL test + restart comparison |
| GET list/detail, POST, PUT, DELETE | OrchidController | MockMvc + Postman + E2E |
| Status 200/201/204/404 | Controller | Positive/negative assertions |
| CORS cho Vite | CorsConfig | Preflight allow/reject + browser GET |
| React/Vite + Axios | frontend | Build + network assertions |
| Tập trung API URL trong .env | .env.example + orchidApi.ts | Collection path và request URL |
| Danh sách dữ liệu từ DB | App.tsx | API/UI/SQL count |
| Tạo/sửa/xóa qua UI | EditOrchid/App | E2E POST/PUT/DELETE |
| Điều hướng SPA | main.tsx, Link | Detail reload + create/edit navigation |
| Trang detail theo tài liệu gửi thêm | OrchidDetail.tsx | ID hợp lệ/missing/invalid |
| Loading/error/empty UI | App/Detail/Edit | Browser tests và kiểm tra ảnh |
| Break-It → Diagnose → Fix | debug-log.md | Request 415 rồi 201 |
| README, test matrix, evidence | README.md, docs/ | Hồ sơ đi kèm |
| Không commit mật khẩu/PDF/build | .gitignore | Kiểm tra staged files |

Tên project/package/database và TypeScript theo yêu cầu người dùng thay cho tên chapter15api/chapter15reactjs, database SBA301_OrchidDB và JavaScript trong ví dụ PDF. Collection dùng `/orchids` theo cấu trúc gửi thêm. Những thay đổi tên này được đồng bộ giữa frontend, backend, SQL và tests.
