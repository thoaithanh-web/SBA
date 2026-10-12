# Break-It and real debugging

| Case | Fault / expected failure | Actual evidence | Root cause và recovery |
| --- | --- | --- | --- |
| B1 | URL localhost:1 thay vì1433; startup phải thất bại | console/break-b1-datasource.txt: TCP connection refused, exit1 | Datasource config; chạy lại URL1433, API/CRUD pass |
| B5 | POST categoryId không tồn tại | break-it-http.json:400 | Service lookup; dùng ID category vừa tạo, POST201 |
| B6 | GET ID không tồn tại | break-it-http.json:404 | Resource lookup; GET ID vừa POST trả200 |
| B7 | POST JSON `{invalid` | break-it-http.json:400 | Jackson parsing; gửi JSON hợp lệ, POST201 |

B1 thực hiện bằng override runtime args, không đổi cấu hình cuối. B5/B6/B7 là request lỗi có chủ đích theo bảng Slot18, không sửa mapping/repository để tạo lỗi khác. Recovery được kiểm tra bằng live Postman collection và full integration suite.

## Schema acronym bug: red → green

Đợt test đầu: Java field orchidID sinh cột orchidid qua naming strategy, trong khi SQL evidence/query dùng orchid_id. Ba SQL integration tests lỗi Invalid column name 'orchid_id'. Evidence console/schema-red.txt.

Fix: @Column(name="orchid_id") trên primary key, kiểm tra schema thật thay vì đoán tên; database test do lượt này tạo được đổi tên cột tương ứng để đối chiếu lại. Database ứng dụng mới được Hibernate tạo ngay với mapping rõ ràng. Sau sửa:23 tests PASS và SQL evidence xác nhận cột/FK. Không đổi tên field JSON orchidID theo đề.
