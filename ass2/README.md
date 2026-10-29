<!-- Author: Lam Thoai Thanh - CE190169 -->
# Assignment 02 — FU News Management System

Lâm Thoại Thanh · CE190169 · SE1910 · SBA301 · version 1.0.0.

React + Axios gọi Spring Boot 3 REST API; dữ liệu lưu trong SQL Server. Backend chia Controller → Service → Repository. Hai project và database cùng tên `A2LamThoaiThanh_SE1910`, đúng mẫu đề.

## Chạy bài trên Windows

Cần Java 21, Node.js 22.13+, SQL Server TCP/IP tại localhost:1433 và SSMS. Giữ hai terminal riêng FE/BE.

### Database

**A2LamThoaiThanh_SE1910 đã được tạo trên máy hiện tại** và kiểm thử trực tiếp. SSMS: Refresh Databases → A2LamThoaiThanh_SE1910 → Tables.

Máy mới: mở [001-schema-and-seed.sql](backend/A2LamThoaiThanh_SE1910/sql/001-schema-and-seed.sql) trong SSMS rồi Execute. Script tạo DB/bảng/khóa ngoại/sequence/seed; chạy lại không xóa dữ liệu hiện có. JPA dùng `ddl-auto=update`; `create-drop` chỉ dùng H2 test.

Mật khẩu SQL Server trên máy hiện tại nằm trong `backend/A2LamThoaiThanh_SE1910/config/application-local.properties`, bị Git bỏ qua. Máy mới sao chép file `.example` rồi cấu hình local hoặc đặt DB_PASSWORD; không commit mật khẩu.

### Backend

```powershell
cd C:\Users\ASUS\Desktop\SBA\assignment-repo\ass2\backend\A2LamThoaiThanh_SE1910
.\mvnw.cmd spring-boot:run
```

Chờ Tomcat started on port8082. API: http://localhost:8082/api/public/news.

Chưa có config local thì nhập mật khẩu trong terminal trước khi chạy:

```powershell
$secret = Read-Host 'SQL Server password' -AsSecureString
$env:DB_PASSWORD = [System.Net.NetworkCredential]::new('', $secret).Password
```

Biến cấu hình: DB_URL, DB_USERNAME, DB_PASSWORD, SERVER_PORT, CORS_ALLOWED_ORIGINS. Mặc định đúng DB localhost:1433, username sa. Maven launcher tải Maven vào cache nếu cần.

### Frontend

```powershell
cd C:\Users\ASUS\Desktop\SBA\assignment-repo\ass2\frontend\A2LamThoaiThanh_SE1910
npm ci
npm run dev
```

Mở **http://localhost:5174**. FE mặc định gọi http://localhost:8082/api. `.env.example` là mẫu đổi API. Dùng hostname localhost nhất quán; đổi port FE cần cập nhật CORS backend. Nếu port bận, kiểm tra terminal Ass2 đang chạy và dùng trang đó hoặc Ctrl+C đúng terminal. Dừng JAR cũ trước build lại trên Windows để tránh khóa file.

## Tài khoản demo từ SQL của đề

| Role | Email | Password |
| --- | --- | --- |
| Admin (1) | SteveParis@FUNewsManagement.org | @1 |
| Staff (2) | EmmaWilliam@FUNewsManagement.org | @1 |

Đây là tài khoản mẫu thực hành công khai. Backend đổi password seed cũ thành BCrypt một lần lúc khởi động. Password mới dài6–64 ký tự. Chạy seed lại không reset password đã đổi.

## Chức năng

| Người dùng | Quyền |
| --- | --- |
| Khách | Xem/tìm tin Published và chi tiết; Draft trả404 |
| Admin | CRUD/search accounts; không xóa người đã tạo tin; không tự xóa/hạ quyền mình |
| Staff | CRUD/search categories, news gồm tags; tạo/sửa popup, xóa có xác nhận |
| Staff | Sửa profile của mình; history chỉ tin mình tạo |

Category có tin hoặc category con không xóa được. Xóa tin xóa NewsTag nhưng giữ Tag tái sử dụng. Creator/updater lấy từ session; không tin ID do FE gửi. Admin không dùng các API quản lý riêng của Staff.

Cookie HttpOnly/session30phút, BCrypt, CSRF trên request ghi. Không lưu credentials vào localStorage; response không có password/hash. Admin đổi role/password thu hồi các session của account bị sửa; My profile đổi password giữ phiên hiện tại. Cấu hình demo localhost HTTP; triển khai HTTPS cần cookie Secure và CORS/domain phù hợp.

## Cấu trúc

```text
ass2/
  backend/A2LamThoaiThanh_SE1910/
    pom.xml, mvnw.cmd, scripts/
    config/application-local.properties.example
    sql/001-schema-and-seed.sql
    src/main/java/fu/se/ass2/
      config/ controller/ dto/ entity/
      repository/ service/ exception/
    src/main/resources/application.properties
    src/test/ (API H2 và SQL Server integration)
  frontend/A2LamThoaiThanh_SE1910/
    src/api/ context/ layouts/ components/ pages/
    tests/ (Playwright gọi backend thật)
  docs/ (yêu cầu, luồng, demo, minh chứng)
```

## Kiểm tra lại

Backend, thư mục pom.xml:

```powershell
.\mvnw.cmd test
$env:SQLSERVER_TESTS='true'
.\mvnw.cmd verify
Remove-Item Env:SQLSERVER_TESTS
```

Mặc định18tests H2; test SQL Server bỏ qua nếu chưa bật biến. Bật biến chạy thêm1test API/JPA/JDBC trên SQL Server và rollback dữ liệu test. Sequence có thể tăng sau rollback; ID không liên tục. Dừng JAR đang chạy trước verify trên Windows.

Frontend, thư mục package.json; BE phải chạy trước:

```powershell
npm run format:check
npm run lint
npm run build
npx playwright install chromium
npm test
```

Playwright tự bật Vite nếu cần, tạo dữ liệu E2E riêng và dọn sau chạy; không chạy test trên DB production. CI [.github/workflows/ass2.yml](../.github/workflows/ass2.yml) dựng SQL Server cô lập, chạy API/SQL/browser tests và build/lint/format. Mật khẩu CI sinh tạm và che trong log.

## Ôn interview

- [Đối chiếu yêu cầu và SQL nguồn](docs/REQUIREMENTS.md)
- [Luồng chạy, tìm file, demo và change impact](docs/INTERVIEW_AND_DEMO.md)
- [Kết quả kiểm thử và ảnh thực tế](docs/VERIFICATION.md)

Commit theo giai đoạn thực hiện thật, Conventional Commits, push main theo yêu cầu chủ repo. Có AI hỗ trợ triển khai/kiểm tra/tài liệu; sinh viên cần tự kiểm chứng và trình bày bằng lời của mình. Header tác giả thể hiện người sở hữu bài nộp, không thay việc chứng minh hiểu code. Không đưa PDF, bí mật kết nối, node_modules, target, dist lên Git.
