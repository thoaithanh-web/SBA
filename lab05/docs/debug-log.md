# Debug và Break-It → Diagnose → Fix

## Sai Content-Type — tình huống tích hợp đã thực hiện

1. Gửi payload Orchid hợp lệ tới POST `/orchids`, cố ý dùng `Content-Type: text/plain`.
2. HTTP thực tế: 415. Request đã đến backend; URL, SQL Server và repository không phải nguyên nhân.
3. Chẩn đoán: `@RequestBody Orchid` cần JSON converter; header không khai báo JSON.
4. Sửa riêng Content-Type thành `application/json`, giữ nguyên payload và URL.
5. HTTP thực tế: 201, có ID do SQL Server sinh. Xóa record thử trả 204; GET lại trả 404.

Bằng chứng: [break-fix.json](evidence/break-fix.json). Đây là tình huống do tác nhân thực hiện, không khẳng định sinh viên đã tự thực hiện workshop.

## TypeScript phát hiện truy cập state null

Build báo `loadError is possibly null` ở biểu thức `loadError?.id === id ? loadError.error : ''`. Khi cả id và loadError?.id đều undefined, điều kiện có thể đúng trong create mode. Sửa thành kiểm tra `loadError && loadError.id === id` trước khi đọc error. Build và browser create/edit đã đạt sau sửa.

## Type-check callback chạy trong browser

Tests có `page.evaluate()` đọc document/window nhưng tsconfig.node ban đầu chỉ khai báo ES2022. Build báo thiếu DOM types. Thêm DOM vào lib của config chứa tests; giữ strict type-check, không tắt lỗi hoặc bỏ tests ra khỏi kiểm tra.

## Đồng bộ đường dẫn collection

PDF minh họa `/orchids/`; tài liệu cấu trúc người dùng yêu cầu `/orchids`. Backend dùng @GetMapping/@PostMapping không suffix, Axios dùng path chuỗi rỗng. Test xác nhận `/orchids` 200, `/orchids/` 404 để phát hiện việc vô tình thêm dấu slash.

## Các giới hạn cần tự kiểm tra khi demo

Nếu Postman thành công nhưng browser thất bại, kiểm tra Origin và preflight trước khi sửa repository. Nếu UI nhận 2xx mà dữ liệu sai, đối chiếu JSON field natural/attractive và SELECT đúng database. Không dừng SQL Server hoặc xóa database dùng chung chỉ để thử lỗi.
