# Kiến trúc và trace Lab05

## Khởi động

Backend: `BackendApplication.main()` → Spring Boot scan `fu.se.backend` → cấu hình datasource SQL Server → Hibernate nhận/tạo `dbo.Orchid` → repository proxy → service/controller → HTTP port 8080.

Frontend: `package.json` chạy Vite → `index.html` tải `main.tsx` → BrowserRouter → NavBar + route + footer. `/` render `App`; `/orchids/new` render EditOrchid create mode; `/orchids/:id/edit` render EditOrchid; `/orchids/:id` render OrchidDetail.

## Một GET list đi qua đâu

```text
App.tsx useEffect
→ orchidApi.ts getOrchids()
→ Axios GET http://localhost:8080/orchids
→ CorsConfig kiểm tra origin browser
→ OrchidController.findAll()
→ OrchidService.findAll()
→ OrchidRepository.findAll(Sort)
→ Hibernate/JDBC SELECT
→ OrchidManagementDB.dbo.Orchid
← rows → List<Orchid> → JSON 200 → response.data
→ setState({ status: 'loaded', orchids })
→ React render bảng
```

## Thêm/sửa

`EditOrchid.tsx` giữ controlled form. Khi sửa, lấy id bằng useParams, GET detail và điền đủ sáu trường. Null của các trường tùy chọn được đổi thành chuỗi rỗng. Khi submit, trim dữ liệu, giữ boolean từ checkbox, gọi createOrchid hoặc updateOrchid. Chỉ navigate về list khi request thành công; lỗi giữ nguyên form và hiện alert.

Controller dùng `@Valid` kiểm tra entity → Service bảo toàn identity, cập nhật mọi field → Repository save trong transaction → SQL Server commit → JSON 201/200. Create bỏ ID từ body; update tìm bản ghi theo ID URL trước khi đổi dữ liệu.

## Xóa

`App.tsx` chọn record → Modal xác nhận. Hủy không gọi DELETE. Xác nhận gọi deleteOrchid → Controller → Service tìm record → repository.delete → SQL DELETE → 204. Sau đó frontend gọi GET list lại. Nếu lỗi, modal vẫn mở và hiện thông báo.

## Detail và điều hướng

Ảnh/tên trong App là Link tới `/orchids/:id`; OrchidDetail gọi getOrchid. State gắn kèm id để response cũ không được hiển thị cho URL mới. ID phải là số nguyên dương trong miền Java Integer. Các request GET dùng AbortController, cleanup hủy request khi route đổi hoặc unmount. 404 hiển thị thông báo thay vì dữ liệu giả.

## Mapping dữ liệu

| JSON/Java | SQL Server |
| --- | --- |
| orchidId | OrchidID, int IDENTITY, PK |
| orchidName | OrchidName, nvarchar(150), NOT NULL |
| natural | IsNatural, bit, NOT NULL |
| orchidDescription | OrchidDescription, nvarchar(1000) |
| orchidCategory | OrchidCategory, nvarchar(100) |
| attractive | IsAttractive, bit, NOT NULL |
| orchidURL | OrchidURL, varchar(1000) |

`@Nationalized` bảo toàn tiếng Việt. PhysicalNamingStrategyStandardImpl giữ nguyên các tên cột đã khai báo; không sinh thêm cột snake_case.

## Quyết định thiết kế

- Hai project độc lập theo cấu trúc được cung cấp; frontend gọi REST, không chứa credentials database.
- Axios dùng base URL tập trung, collection path rỗng để không thêm dấu `/` cuối.
- CORS allowlist origin cụ thể, có preflight cho JSON POST/PUT/DELETE.
- SQL Server là nguồn dữ liệu; React state chỉ giữ kết quả hiện tại để render.
- TypeScript mô tả dữ liệu; validation thật vẫn nằm ở backend. Typed response của Axios không tự kiểm tra JSON runtime.
- H2 chỉ nằm trong test dependencies/profile; integration test tùy chọn dùng SQL Server thật.
- SVG ảnh mẫu được phục vụ bởi frontend, database chỉ lưu URL.

## File sở hữu chức năng

`main.tsx`: routing; `App.tsx`: collection/search/delete; `EditOrchid.tsx`: create/update; `OrchidDetail.tsx`: detail; `OrchidImage.tsx`: ảnh/fallback; `orchidApi.ts`: HTTP/error translation; `types.ts`: contract/ID guard; Controller: HTTP status; Service: transaction và CRUD; Repository: JPA; Entity: mapping/validation; CorsConfig: origin; ApiExceptionHandler: validation JSON error.
