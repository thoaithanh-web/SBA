# Orchid Management — Lab 05

Ứng dụng full-stack quản lý hoa lan của Lâm Thoại Thanh · CE190169 · SE1910, theo hướng dẫn SBA301 Lab 05 và cấu trúc được cung cấp.

- `backend/`: Java 21, Spring Boot 3, Spring Web, Spring Data JPA, SQL Server.
- `frontend/`: React, TypeScript, Vite, Axios, React Router, React Bootstrap.
- Database: `OrchidManagementDB`, bảng `dbo.Orchid`.
- Backend: `http://localhost:8080`; frontend: `http://localhost:5173`.

## Chức năng

- Danh sách từ REST API, tìm theo tên/phân loại và tải lại dữ liệu.
- Tạo mới, cập nhật đầy đủ sáu trường, xác nhận trước khi xóa.
- Nhấn ảnh hoặc tên để xem trang chi tiết `/orchids/:id`.
- Loading, empty state, thông báo lỗi và nút thử lại khi mất kết nối.
- Giữ form khi lưu thất bại; chặn gửi lặp khi đang lưu/xóa.
- Ảnh lỗi có fallback; giao diện responsive, bảng cuộn ngang trên mobile.
- Dữ liệu thật trong SQL Server; frontend không dùng localStorage để thay thế database.

## 1. Chuẩn bị SQL Server

SQL Server cần chạy, bật TCP/IP và lắng nghe port `1433`. Kết nối SSMS bằng đúng instance có database. Mở [sql/create-database.sql](sql/create-database.sql) để tạo database nếu chưa tồn tại:

```sql
IF DB_ID(N'OrchidManagementDB') IS NULL
    CREATE DATABASE OrchidManagementDB;
```

Backend dùng SQL Authentication, username mặc định `sa`. Password không được commit. Trên máy đã triển khai, password local nằm trong `backend/config/application-local.properties`, đã được Git bỏ qua. File được đọc khi working directory là `backend`.

Trên máy mới, có thể đặt biến môi trường trong terminal sẽ chạy backend:

```powershell
$env:DB_USERNAME = 'sa'
$env:DB_PASSWORD = '<mat-khau-sql-server-cua-ban>'
```

Các biến ghi đè: `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `SERVER_PORT`, `CORS_ALLOWED_ORIGINS`, `SHOW_SQL`. Nếu dùng file local để nhập password, đặt working directory đúng `backend` và không commit file đó. Có mẫu tại `backend/config/application-local.properties.example`.

JDBC URL mặc định:

```text
jdbc:sqlserver://localhost:1433;databaseName=OrchidManagementDB;encrypt=true;trustServerCertificate=true
```

`trustServerCertificate=true` phục vụ SQL Server local. `ddl-auto=update` tạo/cập nhật bảng khi backend chạy; không xóa database hoặc chuyển sang `create` trên dữ liệu cần giữ.

## 2. Chạy backend

Trong PowerShell:

```powershell
cd lab05/backend
.\mvnw.cmd spring-boot:run
```

Launcher Windows dùng JDK 21 tại `C:\Program Files\Java\jdk-21` nếu có; máy khác cần đặt `JAVA_HOME` tới JDK 21. Launcher dùng Maven đã cài hoặc tải Maven 3.9.12 vào cache ngoài repo và kiểm tra SHA-512. Nếu có Maven trong PATH, cũng có thể dùng `mvn spring-boot:run`.

Trong IntelliJ IDEA:

1. Mở `backend/pom.xml`, Load Maven Project và chọn SDK Java 21.
2. Mở `fu.se.backend.BackendApplication`, Run hàm `main()`.
3. Đặt Working directory là thư mục `backend`. Để Active profiles trống khi chạy SQL Server; `test` chỉ dành cho H2 trong kiểm thử.
4. Kiểm tra `GET http://localhost:8080/orchids` trả `200` và JSON array.

Hibernate giữ nguyên tên bảng/cột đã khai báo bằng `PhysicalNamingStrategyStandardImpl`. Ba trường tiếng Việt dùng NVARCHAR để lưu nguyên dấu.

## 3. Chạy frontend

Trong terminal khác:

```powershell
cd lab05/frontend
npm ci
Copy-Item .env.example .env
npm run dev
```

Yêu cầu Node.js 22.13 trở lên trong nhánh Node 22. File `.env`:

```dotenv
VITE_API_URL=http://localhost:8080/orchids
```

Mở `http://localhost:5173`. Script dùng `--strictPort`: nếu port đang bận, dừng đúng ứng dụng đang giữ port trước khi chạy. Không tự chuyển port vì CORS phải khớp origin.

Trong IntelliJ, tạo npm Run Configuration với package file `frontend/package.json`, script `dev`, working directory `frontend`.

Sau khi sửa `.env`, khởi động lại Vite. Không đặt password database trong biến `VITE_*` vì các biến này được đưa tới trình duyệt.

## 4. Dữ liệu mẫu và kiểm tra SQL

Sau khi backend tạo bảng, có thể chạy [sql/seed.sql](sql/seed.sql) để thêm ba mẫu nếu chưa có. Script không xóa dữ liệu. Trong lần triển khai local, ba mẫu đã được tạo qua POST API trước khi kiểm thử frontend.

Ảnh mẫu là SVG minh họa do dự án tự tạo ở các lab trước và tái sử dụng trong thư mục `frontend/public/images`. URL ảnh mẫu trỏ tới frontend local; nếu đổi hostname/port khi triển khai, cập nhật URL này. Không có chức năng upload ảnh.

Mở [sql/verify.sql](sql/verify.sql) trong SSMS:

```sql
USE OrchidManagementDB;
SELECT OrchidID, OrchidName, IsNatural, OrchidDescription,
       OrchidCategory, IsAttractive, OrchidURL
FROM dbo.Orchid;
```

Đối chiếu số dòng SQL = số object GET `/orchids` = tổng bộ sưu tập trên UI khi không tìm kiếm. Khi tìm kiếm, UI chỉ lọc kết quả đã tải.

## REST API

| Method | Endpoint | Thành công | ID không tồn tại |
| --- | --- | --- | --- |
| GET | `/orchids` | 200 + array | — |
| GET | `/orchids/{id}` | 200 + object | 404 |
| POST | `/orchids` | 201 + object + Location | — |
| PUT | `/orchids/{id}` | 200 + object | 404 |
| DELETE | `/orchids/{id}` | 204 | 404 |

Collection endpoint không có dấu `/` cuối, đúng cấu trúc được cung cấp. Axios gọi `get('')` và `post('', payload)` để tránh sai route. Bản PDF dùng dấu `/` cuối ở ví dụ; cách triển khai này đồng bộ frontend/backend theo tài liệu cấu trúc đính kèm.

```json
{
  "orchidName": "Taichung Beauty",
  "natural": false,
  "orchidDescription": "Hoa lan Cattleya",
  "orchidCategory": "Cattleya",
  "attractive": true,
  "orchidURL": "http://localhost:5173/images/cattleya.svg"
}
```

ID tự sinh; service bỏ qua ID trong body khi tạo và giữ nguyên ID trên URL khi sửa. JSON dùng `natural`/`attractive`; SQL dùng `IsNatural`/`IsAttractive`.

Validation: tên bắt buộc, tối đa 150 ký tự; category tối đa 100; description/URL tối đa 1000. URL nếu nhập chỉ nhận http/https. Dữ liệu sai trả 400 với `detail` và lỗi theo trường. Body sai Content-Type trả 415. Các trường văn bản tùy chọn có thể null; frontend chuyển null thành chuỗi rỗng để chỉnh sửa.

## Cấu trúc

```text
lab05/
├── backend/
│   ├── pom.xml
│   ├── mvnw.cmd
│   ├── config/application-local.properties.example
│   ├── scripts/maven.ps1
│   └── src/
│       ├── main/java/fu/se/backend/
│       │   ├── BackendApplication.java
│       │   ├── config/CorsConfig.java
│       │   ├── config/ApiExceptionHandler.java
│       │   └── orchids/
│       │       ├── Orchid.java
│       │       ├── OrchidRepository.java
│       │       ├── OrchidService.java
│       │       └── OrchidController.java
│       ├── main/resources/application.properties
│       └── test/
├── frontend/
│   ├── .env.example
│   ├── package.json
│   ├── public/images/
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── OrchidDetail.tsx
│   │   ├── types.ts
│   │   ├── services/orchidApi.ts
│   │   └── components/
│   │       ├── NavBar.tsx
│   │       ├── EditOrchid.tsx
│   │       └── OrchidImage.tsx
│   └── tests/orchids.spec.ts
├── sql/
├── postman/
└── docs/
```

Theo cấu trúc người dùng: package `fu.se.backend.orchids`, frontend TypeScript, danh sách trong `App.tsx` và detail trong `OrchidDetail.tsx`. Các thành phần tương đương `ListOfOrchids` của PDF nằm trong `App.tsx`; vẫn giữ luồng Controller → Service → Repository và hai project độc lập.

## Kiểm thử

Backend, H2 tự động và không tác động database SQL Server:

```powershell
cd lab05/backend
.\mvnw.cmd test
```

Thêm integration test SQL Server thật, chỉ tạo/xóa record của chính test:

```powershell
$env:SQLSERVER_TESTS = 'true'
.\mvnw.cmd clean verify
Remove-Item Env:\SQLSERVER_TESTS
```

Frontend, sau khi backend SQL Server đã chạy:

```powershell
cd lab05/frontend
npm run format:check
npm run lint
npm run build
npm test
```

Playwright tự mở Vite nếu chưa có server. Browser tests CRUD dùng API thật; hai tình huống mất kết nối/lưu lỗi chủ động mô phỏng lỗi HTTP để kiểm tra UI. Các record test có prefix riêng và được dọn sau test; không reset dữ liệu mẫu.

Import [Postman collection](postman/Lab05.postman_collection.json), Run Collection theo thứ tự để kiểm tra API độc lập. Collection tạo một record tạm, cập nhật rồi xóa record đó.

GitHub Actions [Lab05 Full Stack](../.github/workflows/lab05.yml) dựng SQL Server riêng trong CI, chạy backend tests, format/lint/build frontend và browser tests.

## Tài liệu và giới hạn

- [Luồng từng file và trace request](docs/architecture.md)
- [Đối chiếu yêu cầu](docs/requirements.md)
- [Test matrix và kết quả](docs/verification.md)
- [Break-It → Diagnose → Fix](docs/debug-log.md)
- [Ghi nhận sử dụng AI](docs/ai-usage.md)

Đây là lab tích hợp, chưa có authentication/authorization, pagination, upload ảnh, migration schema hay cơ chế xử lý ghi đồng thời. Entity được dùng trực tiếp làm request/response theo cấu trúc lab; khi phát triển production nên tách DTO và quản lý schema bằng migration.
