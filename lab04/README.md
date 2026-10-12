# Lab 04 · Orchid REST API & JPA

Lâm Thoại Thanh · CE190169 · SE1910 · SBA301.

Spring Boot 3.5.16, JDK21, Spring Data JPA/Hibernate và Microsoft SQL Server. Theo đề Lab04 gốc và Slot18 integration kit. Quan hệ bắt buộc Orchid N–1 OrchidCategory, CRUD/search, transaction, kiểm chứng FK và persistence. Đây là backend, không yêu cầu giao diện React.

## Chạy nhanh trên máy Windows hiện tại

SQL Server mặc định đang lắng nghe localhost:1433 và Windows account có quyền tạo database:

```powershell
.\scripts\run.ps1
```

Script dùng JDK21, chuẩn bị Maven nếu thiếu, tải DLL xác thực SQL Server chính thức ngoài repo và dùng Windows Integrated Security. Nếu có sqlcmd, chỉ tạo `SBA_Lab04_Orchid` khi database chưa tồn tại. Không đổi cấu hình instance, không tạo login hoặc lưu mật khẩu. Nếu instance/cổng/quyền khác, cấu hình bằng biến môi trường theo phần dưới.

Swagger: http://localhost:8084/swagger-ui/index.html. List API: http://localhost:8084/api/orchids. Database mới chưa có records: POST category trước, lấy categoryId rồi POST orchid. Có thể chạy Postman collection để thử đầy đủ và dọn records thử.

## SQL authentication / môi trường khác

Tạo database bằng `sql/create-database.sql`. Đặt các biến ngoài source:

```powershell
$env:DB_URL='jdbc:sqlserver://localhost:1433;databaseName=SBA_Lab04_Orchid;encrypt=true;trustServerCertificate=true'
$env:DB_USERNAME='YOUR_DATABASE_USER'
$env:DB_PASSWORD=Read-Host 'Database password' -MaskInput
.\scripts\run.ps1
```

`Read-Host -MaskInput` dùng PowerShell7. Trên môi trường khác, đặt secret bằng cơ chế env của terminal/IDE. Không commit credential. Nếu dùng IntelliJ, chọn Project SDK21, Maven JDK21, Environment variables của Run Configuration rồi chạy `OrchidApplication`; SQL auth không cần DLL Windows. `trustServerCertificate=true` phục vụ môi trường lab local.

## Test và build

Dừng app trước clean/package trên Windows.

```powershell
.\scripts\run.ps1 -Task package -SqlServer
```

Mặc định script trên dùng database test riêng `SBA_Lab04_Test` và bật `SQLSERVER_TESTS=true`. Khi tự đặt DB_URL, hãy trỏ vào database test riêng. Chín integration tests dùng transaction rollback mỗi test; không dùng H2 thay SQL Server.

Với Maven có sẵn:

```sh
mvn clean verify
```

Lệnh này chạy 14 unit/web-slice tests; 9 SQL Server integration tests chỉ chạy khi `SQLSERVER_TESTS=true` và datasource test đã cấu hình. Bộ đã kiểm tra đầy đủ là 23/23 PASS với SQL Server2022 thật ngày 12/10/2026. GitHub Actions chuẩn bị SQL Server2022 riêng và bật cả 23 tests.

## API và dữ liệu

| Method | Endpoint | Status |
| --- | --- | --- |
| GET | `/api/orchids` hoặc `?name=cat` | 200 |
| GET | `/api/orchids/{id}` | 200 / 404 |
| POST | `/api/orchids` | 201 + Location / 400 |
| PUT | `/api/orchids/{id}` | 200 / 400 / 404 |
| DELETE | `/api/orchids/{id}` | 204 / 404 |
| GET | `/api/categories` | 200 |
| POST | `/api/categories` | 201 / 400 / 409 |
| DELETE | `/api/categories/{id}` | 204 / 404 / 409 nếu còn orchids |

`/orchids` và `/orchids/` là alias để tương thích URL đề gốc; `/api/orchids` là endpoint chính của Slot18.

```json
{
  "orchidName":"Cattleya Queen",
  "isNatural":true,
  "orchidDescription":"An illustrative lab record",
  "orchidCategory":{"categoryId":1},
  "isAttractive":true,
  "orchidURL":"https://example.edu/orchid.svg"
}
```

Category phải tồn tại. ID trong ví dụ phải thay bằng ID response thật. Create bỏ qua orchidID do client gửi; PUT cập nhật đủ trạng thái, không đổi ID. Service resolve category managed trước save; không tự tạo category từ nested request. `@JsonIgnore` phía collection tránh JSON recursion; không cascade REMOVE/ALL. Hibernate `ddl-auto=update` phục vụ lab, không phải migration production.

## Kiểm chứng và Postman

Import `postman/Lab04.postman_collection.json`, Run Collection theo thứ tự. Collection tự lấy categoryId/orchidId, kiểm tra 11 requests rồi xóa records thử. Đã chạy Newman trên server kết nối SQL Server thật: 11/11 assertions PASS.

```sh
npx --yes newman run postman/Lab04.postman_collection.json
```

Kiểm tra schema/rows bằng `sql/verify-schema.sql`. Evidence trong `docs/evidence/`: HTTP responses thật, FK/schema, lỗi cấu hình, regression schema và persistence sau restart. Đây là evidence từ Newman/sqlcmd/tests, không giả nhận thao tác GUI Postman/SSMS. Xem [contract](docs/api-contract.md), [trace](docs/concept-trace.md), [test matrix](docs/test-matrix.md), [debug log](docs/debug-log.md).

## Giới hạn và AI

Chưa có auth, React frontend hoặc production deployment. Không cấu hình database toàn cục thay người dùng. AI đã hỗ trợ phần lớn code/test/docs; [AI usage](docs/ai-usage.md) ghi rõ Human Verification Gate và phần sinh viên tự demo/giải thích chưa được xác nhận.
