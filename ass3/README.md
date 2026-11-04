<!-- Author: Lam Thoai Thanh - CE190169 -->
# Assignment 03 FU Mini Hotel

Lâm Thoại Thanh · CE190169 · SE1910 · SBA301

React dùng Axios để gọi REST API của Spring Boot 3. Spring Security kiểm tra JWT trước khi chuyển yêu cầu tới controller. Service xử lý nghiệp vụ và Spring Data JPA lưu dữ liệu vào SQL Server.

## Chạy trên Windows

Cần JDK 21, Node.js 22.13+ và SQL Server TCP/IP trên cổng 1433. Backend, frontend và database đều có tên `A3LamThoaiThanh_SE1910`.

1. Mở SSMS và chạy [script tạo database](backend/A3LamThoaiThanh_SE1910/sql/001-create-database.sql). Script tạo database nếu chưa có. Hibernate tạo bảng khi backend khởi động và thêm 3 loại phòng, 6 phòng mẫu ở lần đầu.
2. Trong thư mục backend, sao chép `config/application-local.properties.example` thành `config/application-local.properties`. Điền mật khẩu SQL Server và mật khẩu Staff vào file này. File cấu hình local được Git bỏ qua. Máy hiện tại đã có database và file cấu hình local.
3. Mở hai terminal riêng và chạy các lệnh dưới đây.

Nếu đã chạy bản ASS3 từ commit đầu, dừng backend và chạy [script cập nhật kiểu cột](backend/A3LamThoaiThanh_SE1910/sql/002-align-existing-columns.sql) trong SSMS trước khi mở lại.

Backend, từ thư mục `ass3`:

```powershell
cd .\backend\A3LamThoaiThanh_SE1910
.\mvnw.cmd spring-boot:run
```

Frontend, từ thư mục `ass3`:

```powershell
cd .\frontend\A3LamThoaiThanh_SE1910
npm ci
npm run dev
```

Mở **http://localhost:5175/**. API mặc định chạy tại **http://localhost:8083/api**. Hai cổng được chọn riêng cho ASS3 để có thể chạy cùng ASS2.

Staff đăng nhập bằng email `staff@fuminihotel.local` và mật khẩu ở dòng `app.staff.password` của file cấu hình local. Có thể cấu hình Staff qua `HOTEL_STAFF_EMAIL` và `HOTEL_STAFF_PASSWORD` khi dùng cấu hình mặc định. Customer tự đăng ký. Các biến kết nối SQL Server gồm `DB_URL`, `DB_USERNAME` và `DB_PASSWORD`. Frontend đọc `VITE_API_URL`, backend đọc `HOTEL_FRONTEND_ORIGIN` để cho phép origin tương ứng.

## Phạm vi chức năng

| Quyền | Chức năng |
| --- | --- |
| Khách | Xem danh sách và chi tiết phòng đang hoạt động, tìm theo số phòng, lọc phòng trống theo khoảng ngày |
| Customer | Đăng ký, đăng nhập, đặt một hoặc nhiều phòng trong cùng đơn, tìm và xem lịch sử của mình, sửa hồ sơ và mật khẩu |
| Staff | Tìm, xem, thêm, sửa và xóa khách hàng hoặc phòng. Tạo đơn tại quầy, tìm và xem đơn cùng chi tiết, sửa đơn, hủy hoặc hoàn tất đơn |

Khi Staff xóa phòng, hệ thống xóa bản ghi nếu phòng chưa có dòng liên kết trong `BookingDetail`. Nếu còn liên kết, hệ thống chuyển phòng sang ngừng hoạt động và giữ chi tiết đặt. Khách hàng có đơn được xử lý tương tự để giữ lịch sử. Hủy đơn giữ dữ liệu và giải phóng lịch. Đơn chỉ được hoàn tất từ ngày trả phòng trở đi.

Backend lấy mã Customer từ JWT khi xử lý đặt phòng trực tuyến và lịch sử. Một đơn chứa tối đa 20 phòng khác nhau. Mỗi phòng có ngày nhận và ngày trả riêng. Hệ thống khóa bản ghi phòng trong giao dịch và kiểm tra giao nhau theo khoảng `[ngày nhận, ngày trả)`. Ngày trả của đơn trước có thể trùng ngày nhận của đơn sau. Giá mỗi đêm được chốt trên chi tiết và tổng tiền do backend tính.

## Đối chiếu database FUMiniHotel

Tên bảng, cột và liên kết được đối chiếu với trang 4 của đề ASS3 và script `Assignment 02_FUMiniHotelManagement.sql`.

| Bảng | Liên kết hoặc khóa |
| --- | --- |
| `RoomType` | Một loại có thể có nhiều phòng |
| `RoomInformation` | Mỗi phòng có một `RoomTypeID` |
| `Customer` | Mỗi khách có thể có nhiều đơn |
| `BookingReservation` | Mỗi đơn có một `CustomerID` |
| `BookingDetail` | Khóa ghép `(BookingReservationID, RoomID)`, lưu ngày nhận, ngày trả và giá mỗi đêm |

Giữ cột trạng thái `tinyint` và cột tiền `money`. Cột `Password` dài 100 ký tự để chứa BCrypt. `BookingReservationID` dùng IDENTITY để SQL Server cấp mã cho đơn mới. Khóa ngoại giữ liên kết và service quyết định xóa hay chuyển trạng thái.

## Luồng chạy và bảo mật

| Thao tác | Frontend | Backend |
| --- | --- | --- |
| Mở trang và chọn màn hình | `main.jsx` → `App.jsx` | |
| Xem hoặc tìm phòng | `Rooms.jsx` → `api.js` | `PublicController` → `RoomService` → repository |
| Đăng nhập | `AuthPages.jsx` → `api.js` | `AuthController` → `AuthService` → kiểm tra BCrypt → cấp JWT |
| Đặt phòng hoặc sửa đơn | `Bookings.jsx` → `api.js` | `SecurityConfig` → `CustomerController` hoặc `StaffController` → `BookingService` → repository |
| Quản lý khách hoặc phòng | `StaffRecords.jsx` → `api.js` | `SecurityConfig` → `StaffController` → `CustomerService` hoặc `RoomService` |

Axios gửi token trong `Authorization: Bearer <token>` cho API cần đăng nhập. Token hết hạn sau 30 phút. Mặc định backend tạo khóa ký ngẫu nhiên khi chạy, nên sau khi restart cần đăng nhập lại. Có thể cấu hình khóa ổn định bằng `HOTEL_JWT_SECRET` dài ít nhất 32 byte. API dùng BCrypt cho mật khẩu Customer và chỉ trả thông tin hồ sơ cần hiển thị.

## Demo và kiểm tra

1. Xem chi tiết phòng tại trang chủ trong cửa sổ chưa đăng nhập.
2. Tạo Customer, đăng nhập và đặt hai phòng trong cùng đơn. Mở lịch sử, xem hai dòng chi tiết và tổng tiền.
3. Đăng nhập Staff ở cửa sổ riêng. Tìm đơn, sửa ngày nếu cần, rồi thử xóa phòng có chi tiết đặt. Phòng đổi trạng thái và chi tiết đơn vẫn còn.
4. Hủy đơn, kiểm tra trạng thái trong lịch sử Customer. Tạo đơn tại quầy từ trang Staff nếu cần trình bày luồng offline.

Import [collection Postman](postman/FUMiniHotel.postman_collection.json), đặt giá trị local cho biến `staffPassword` rồi chạy theo thứ tự bằng Collection Runner. Collection tự tạo dữ liệu minh họa trong database đang kết nối. Dùng database thực hành để chạy collection. Kết quả đã kiểm chứng bằng Newman gồm 21 request và 29 assertions đạt. Kiểm tra HTTP độc lập đạt 46 lượt gọi và các phép kiểm tra nghiệp vụ. Đã chạy Maven package, Vite build và demo browser trên SQL Server thật.
