# Debug log thực tế

Ngày: 11/10/2026. Đây là các lỗi quan sát được khi tác nhân chạy test, không ghi nhận là sinh viên đã tự debug.

## D01: Deep link bị đưa về dashboard sau login

- Symptom: truy cập `/news?status=0` trước login, đăng nhập đúng, actual URL `/dashboard` thay vì URL ban đầu.
- Evidence: `auth.spec.js` assertion URL thất bại.
- Root cause: submit gọi navigate về deep link trong khi render authenticated cũng trả Navigate cố định về dashboard; hai cơ chế điều hướng cạnh tranh.
- Fix: chỉ dùng một Navigate theo destination đã kiểm tra ở LoginPage; handler chỉ xác thực.
- Retest: deep link + empty/wrong credentials + refresh/logout tests đều PASS sau sửa.

## D02: Tên field bắt buộc không khớp label chính xác

- Symptom: browser test tìm Username/Category bằng exact label timeout, trong khi field đang hiển thị.
- Evidence: trace chỉ ra locator theo label không tìm được element do ký tự `*` của required marker.
- Root cause: text dùng để lookup label có marker; visual label và lookup exact chưa thống nhất.
- Fix: mỗi input/select có aria-label đúng tên field; required marker vẫn dùng aria-hidden.
- Retest: user/news form, disabled Admin fields và validation tests PASS; không đổi expected behavior để né lỗi.

## D03: Focus modal có thể làm nội dung nhập vào field khác

- Symptom: category option đôi lúc có tên bị ghép thêm description; news test không chọn được category `Editorial lab`.
- Evidence: trace/snapshot cho thấy option `Editorial labA category for repeatable tests.`; selectOption timeout. Mobile test cũng phát hiện focus chưa đúng.
- Root cause: modal transition hoàn tất muộn; callback focus field đầu tiên có thể chạy khi người dùng đã chuyển sang field khác và bắt đầu nhập.
- Fix: callback chỉ focus field đầu nếu active element chưa phải input/textarea/select, không cướp focus của field người dùng đang nhập.
- Retest: full create/category/author/news flow và mobile focus/Escape PASS.

## D04: Recovery test đếm cả success toast như lỗi

- Symptom: sau save thành công, test kỳ vọng không có `role=alert` nhưng vẫn thấy một element.
- Evidence: toast success cũng có role alert theo Bootstrap; unreadable-data warning đã biến mất đúng.
- Root cause: assertion quá rộng, đồng nhất mọi alert với warning.
- Fix: assertion xác định chính warning `Saved data could not be read`, đồng thời kiểm tra snapshot storage có category mới.
- Retest: recovery test PASS, vẫn kiểm tra warning biến mất và dữ liệu hợp lệ; không giảm yêu cầu chức năng.

Các regression tests còn nằm trong suite. Trace/screenshot lỗi cục bộ không đưa vào Git; tài liệu này giữ symptom/root cause/fix/retest. Sinh viên cần bổ sung log của các lỗi mình tự tái hiện và sửa.
