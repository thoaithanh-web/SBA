# AI usage · lab03

Người dùng yêu cầu triển khai bốn lab theo PDF, không comment trong code, kiểm thử và push trực tiếp main. AI đã đọc yêu cầu, thiết kế lớp, tạo phần lớn code, tests, Postman collection, tài liệu và phân tích lỗi. Không xác nhận sinh viên đã tự viết/giải thích toàn bộ.

Nguồn phạm vi: Slot15 versioning/paging/Page/Slice và Slot16 Employee Management/MockMvc/testing. Không có đề Lab03 standalone nên không tự giả định có yêu cầu database/JPA trong core.

Đã kiểm chứng bằng build, test assertions, Newman HTTP requests và regression red→green cho missing employee 404. Evidence được lưu có chọn lọc, không lưu mật khẩu hoặc dump toàn bộ log.

Sinh viên tự thực hiện Human Gate/vấn đáp không dùng AI: trace một POST/GET qua các lớp, giải thích test boundary, sửa một yêu cầu mới và demo trực tiếp. Giải thích stable paging, whitelist sort, v1/v2 và Page vs Slice. Các phần này chưa có bằng chứng để đánh dấu PASS.
