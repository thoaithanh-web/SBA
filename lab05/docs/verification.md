# Kiểm chứng Lab05

Ngày kiểm tra local: 12/10/2026. Môi trường: Windows, Java 21.0.8, Node 22.14.0, SQL Server 2022 và Playwright Chromium.

## Kết quả đã chạy

| Kiểm tra | Kết quả |
| --- | --- |
| Maven package | PASS |
| Backend MockMvc/JPA trên H2 | 12 tests PASS |
| Integration HTTP → SQL Server thật | 1 test PASS |
| Frontend format:check | PASS |
| Frontend ESLint | PASS |
| TypeScript strict + Vite build | PASS |
| Playwright browser integration | 8 tests PASS |
| Postman collection chạy bằng Newman | 10 requests, 17 assertions PASS |
| SQL Server schema | Đúng dbo.Orchid và 7 cột |
| Khởi động lại backend | Giữ nguyên 3 mẫu và ID |
| Break/Fix sai Content-Type | 415 → sửa header → 201, cleanup 204/404 |
| npm audit sau cập nhật dependencies | 0 vulnerabilities |

H2 là môi trường test tự động, không phải datasource chạy ứng dụng. SQLServerIntegrationTest dùng TestRestTemplate và JdbcTemplate để chứng minh thao tác HTTP thực sự thay đổi row SQL Server; test không dùng mock repository và dọn record riêng sau khi chạy.

## Test matrix

| Tình huống | API/UI/DB đã kiểm tra |
| --- | --- |
| List rỗng | GET 200 + [] trên H2 |
| Tạo hợp lệ | POST 201, Location, ID tự sinh, UI có record |
| Xem detail | GET 200, đủ 7 trường, reload route vẫn hiển thị |
| Update | PUT 200, ID giữ nguyên, đổi name/natural/attractive, dữ liệu DB khớp |
| Hủy xóa | Modal đóng, record còn |
| Xóa | DELETE 204, GET lại 404, SQL không còn record |
| ID thiếu | GET/PUT/DELETE 404 |
| ID sai trên frontend | Thông báo invalid ID, không crash |
| Tên trống/khoảng trắng | Backend 400; frontend chặn POST |
| Description quá dài, URL nguy hiểm | Backend 400, không ghi row |
| Body tự gán ID | Create bỏ ID, update giữ ID URL |
| Optional null/boolean | Backend hỗ trợ; form checkbox hiển thị đúng |
| JSON hỏng, path không phải số | 400 |
| Content-Type text/plain | 415 |
| CORS | Preflight origin đúng được phép, origin lạ bị chặn; browser nhận allow-origin |
| Tìm kiếm | Bỏ khoảng trắng, không phân biệt hoa/thường, clear khôi phục collection |
| Mất kết nối mô phỏng | UI có alert, thử lại tải được dữ liệu thật |
| Save 500 mô phỏng | Giữ values và cho phép retry |
| Mobile | List/detail/create không làm document tràn ngang; bảng có vùng cuộn riêng |
| Persistence | So sánh JSON trước/sau restart backend bằng nhau |

## Bằng chứng

- [Backend test results](evidence/backend-tests.json)
- [Postman summary](evidence/postman-summary.json)
- [API và CORS](evidence/api-and-cors.json)
- [SQL schema và rows](evidence/sqlserver.txt)
- [Restart persistence](evidence/persistence.json)
- [Break/Fix request](evidence/break-fix.json)
- [Collection desktop](evidence/01-collection.png)
- [Detail](evidence/02-detail.png)
- [Create form](evidence/03-form.png)
- [Mobile](evidence/04-mobile.png)

Ảnh collection/detail/mobile đã được xem trực tiếp để kiểm tra bố cục. Assertions kiểm tra hành vi; ảnh không thay thế test chức năng. GitHub Actions chạy lại trên SQL Server độc lập trong CI; xem run thực tế trên tab Actions thay vì suy ra CI đạt từ kết quả local.

## Phần sinh viên tự thực hiện

Sinh viên cần tự giải thích request trace, đặt breakpoint Controller/Service, xem DevTools Network và chạy SQL SELECT khi demo. Kiểm thử do tác nhân chạy không chứng minh sinh viên đã tự hoàn thành interview hoặc workshop.
