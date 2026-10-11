# AI usage log

Ngày: 11/10/2026. Công cụ: Codex và built-in ImageGen.

## Phạm vi hỗ trợ đã thực hiện

| Yêu cầu/mục đích | Phần áp dụng | Kiểm chứng |
| --- | --- | --- |
| Đọc các PDF và thực hiện Assignment 01, không comment trong code | Requirement map, architecture, React frontend, docs | Đối chiếu core requirements; build và browser tests |
| Đặt đúng tên sinh viên/lớp/MSSV | LamThoaiThanh_SE1910; Lâm Thoại Thanh; CE190169; SE1910 | package/README/Settings |
| Đặt riêng ass1 để thêm lab sau | `ass1/LamThoaiThanh_SE1910`; PDFs ngoài repo | git tracked-file review |
| Dùng Conventional Commits | Commits tiếng Anh, scope rõ | git log |
| Đẩy thẳng main theo yêu cầu sau cùng | Direct push sau kiểm tra; không tạo PR/review gate | Remote main và GitHub Actions |
| Tạo logo AI theo guide | `public/fu-news-logo.png` | Xem asset, login/sidebar screenshots |
| Viết và chạy kiểm thử/debug | Playwright browser flows, sửa redirect/focus thực tế | TEST_MATRIX.md, DEBUG_LOG.md |

Đây là bản triển khai có AI hỗ trợ đáng kể, gồm cả việc viết code. Không trình bày như source hoàn toàn do sinh viên tự viết. Guide có quy định không sao chép nguyên vẹn source trọn bộ từ AI; sinh viên cần tự đọc, chỉnh sửa, kiểm chứng và xác nhận phạm vi sử dụng AI được lớp chấp nhận trước khi nộp. Các file hướng dẫn không phải bằng chứng rằng sinh viên đã hoàn thành phỏng vấn hoặc transfer task.

## Logo prompt

Built-in ImageGen được dùng, không dùng API key hoặc CLI fallback. Asset cuối nằm ở `public/fu-news-logo.png`.

```text
Use case: logo-brand. Create a crisp minimal square brand symbol for a university news editorial dashboard named FU News. Icon only, no text: a folded open newspaper forming a subtle letter F with a small orange square accent in upper right. Flat geometric design, deep navy #17283c and vivid orange #f2753d, readable at 32px, substantial symbol with generous but not excessive padding, no mockup, no gradients, no shadow, no watermark. Transparent background. This asset will be used in a sidebar and login screen.
```

Asset được xem sau khi sinh và sử dụng trên nền sáng nhỏ để giữ tương phản trong sidebar tối. Trang login dùng illustration CSS riêng; không ghi illustration đó là ảnh ImageGen.

## Phần sinh viên tự ghi sau khi kiểm tra

| Ngày | File/logic đã tự đọc/chỉnh sửa | Lý do | Test đã tự chạy | Giải thích được không dùng AI |
| --- | --- | --- | --- | --- |
| Chưa ghi | Sinh viên điền sau khi thực hiện | | | |

Không tự đánh dấu các mục chưa thực hiện là PASS. Không đưa mật khẩu thật/token vào prompt, source hoặc Git.
