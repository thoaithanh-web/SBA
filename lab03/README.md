# Lab 03 · Employee Management REST API

Lâm Thoại Thanh · CE190169 · SE1910 · SBA301.

Spring Boot 3.5.16 / JDK 21. REST Controller → Service → in-memory Repository. CRUD, validation/errors, URI versioning, paging/sorting, Page/Slice, Swagger/OpenAPI và testing theo Slot15–16. Không có file đề Lab03 riêng trong bộ tài liệu; implementation dùng Employee Management của Slot16 và milestones của Slot15, không thay bằng FUNews demo.

## Chạy trên Windows

```powershell
.\scripts\run.ps1
```

Script chọn JDK21 ở thư mục Java thông dụng nếu có; nếu khác, đặt `JAVA_HOME` trước. Khi chưa có Maven trong PATH, script tải Maven 3.9.12 từ Maven Central, kiểm tra SHA512 và giữ ngoài repo tại `%LOCALAPPDATA%/SBA301Tools`.

Nếu đã có JDK21/Maven hoặc dùng IntelliJ Maven tool window:

```sh
mvn spring-boot:run
```

API: http://localhost:8083/api/employees. Swagger: http://localhost:8083/swagger-ui/index.html. OpenAPI: `/v3/api-docs`. Đổi cổng bằng `SERVER_PORT`.

## Test và package

Dừng app trước `clean` trên Windows để tránh khóa JAR.

```powershell
.\scripts\run.ps1 -Task package
```

Hoặc `mvn clean verify`. Có 27 JUnit tests: 11 web-slice/MockMvc, 6 service/Mockito, 7 repository thuần JUnit, 3 full-context wiring/Swagger tests. Không dùng JPA/H2 cho repository in-memory.

## API

| Method | Endpoint | Kết quả |
| --- | --- | --- |
| GET | `/api/employees?page=0&size=10&sort=salary,desc` | 200, Page DTO |
| GET | `/api/employees/slice?page=0&size=10` | 200, Slice DTO không totals |
| GET | `/api/employees/{id}` | 200 hoặc 404 |
| POST | `/api/employees` | 201 + Location; 400 invalid, 409 duplicate |
| PUT | `/api/employees/{id}` | 200; 400 mismatched id, 404 missing |
| DELETE | `/api/employees/{id}` | 204 hoặc 404 |
| GET/POST/PUT/DELETE | `/api/v1/employees...` | Alias v1 của base API |
| GET | `/api/v2/employees` và `/{id}` | Thêm email/department vào representation |

Body POST/PUT:

```json
{"empId":"E900","name":"Lam Thoai Thanh","designation":"Developer","salary":15000000}
```

`empId`: E + 3–6 chữ số; name/designation bắt buộc; salary hữu hạn, không âm. PUT body ID phải khớp path. Paging 0-based; size 1–100; sort chỉ empId/name/designation/salary với asc/desc. V2 là read representation, email `@example.edu` và department được suy ra để minh họa versioning, không phải thông tin nhân sự thật. V1 không có các field này.

## Postman và evidence

Import `postman/Lab03.postman_collection.json`, chỉnh baseUrl nếu đổi cổng, chạy theo thứ tự. Collection tạo E900, đọc/sửa/xóa và kiểm tra hậu điều kiện; E900 phải chưa tồn tại ở đầu lượt chạy.

```sh
npx --yes newman run postman/Lab03.postman_collection.json
```

Đã chạy collection qua Newman trên server thật: 11/11 assertions PASS. `docs/evidence/api-results.json` giữ response/status thật dạng tóm tắt, không phải screenshot Postman GUI. Xem [test matrix](docs/test-matrix.md), [contract](docs/api-contract.md), [trace](docs/concept-trace.md), [debug](docs/debug-log.md).

## Giới hạn và AI

Dữ liệu seed 25 nhân viên minh họa, thay đổi mất khi restart. Chưa có auth/database/frontend, đúng core in-memory của Lab03. AI hỗ trợ phần lớn implementation/test/docs; [AI usage](docs/ai-usage.md) nêu rõ phần sinh viên tự giải thích và transfer task chưa được xác nhận hoàn thành.
