<!-- Author: Lam Thoai Thanh - CE190169 -->
# Ass2 — Luồng chạy và interview

Lâm Thoại Thanh · CE190169 · SE1910.

## Từ khởi động đến giao diện

1. Terminal BE: mvnw.cmd spring-boot:run → Maven đọc pom.xml (Java21, Boot3, Web, JPA, Validation, Security, SQL Server).
2. A2LamThoaiThanh_SE1910Application.main gọi SpringApplication.run. Spring scan package fu.se.ass2, tạo bean, inject dependency bằng constructor.
3. src/main/resources/application.properties đọc port8082, JDBC URL, env/local config. Hikari kết nối SQL Server; Hibernate map entity, ddl-auto=update cập nhật schema.
4. SecurityConfig tạo BCrypt/AuthenticationManager/CORS/filter chain. LegacyPasswordMigration hash password seed cũ. Tomcat nhận HTTP.
5. Terminal FE: npm run dev → package.json → Vite đọc vite.config.js, phục vụ localhost:5174, biến đổi JSX/modules.
6. Browser → index.html có div#root và module /src/main.jsx → main.jsx import ReactDOM/BrowserRouter/App/Bootstrap/CSS → createRoot().render dựng cây React.
7. App.jsx bọc AuthProvider và Routes. AuthContext GET /api/auth/me kèm cookie để khôi phục user; chưa login401 và user=null; public vẫn mở.
8. Route / → PublicNews.jsx useEffect → Axios api/client.js → GET localhost:8082/api/public/news.
9. Security cho phép public → PublicNewsController → NewsService.list(publicOnly=true) → NewsRepository.search → Hibernate/JDBC → SQL Server SELECT.
10. Entity/Page → Service map NewsResponse → Controller bọc PageResponse → Jackson tạo JSON → Axios nhận → setState → React render card/pagination.
11. Search/đổi trang thay query URL; effect chạy lại. Cleanup abort request cũ. F5 gọi auth/me lại nên giữ phiên backend; localStorage không quyết định quyền.

Vite phục vụ FE; Tomcat phục vụ API; SQL Server giữ dữ liệu. Import JS tải module, HTTP mới gọi sang Java; FE không import Java/SQL trực tiếp.

## Hành động → file → kết quả

FE tính từ frontend/A2LamThoaiThanh_SE1910/src; BE tính từ backend/A2LamThoaiThanh_SE1910/src/main/java/fu/se/ass2.

| Hành động | FE | API | Backend | Output/failure |
| --- | --- | --- | --- | --- |
| Public list/detail | PublicNews.jsx effect → client.js | GET /public/news, /{id} | PublicNewsController → NewsService → NewsRepository | Chỉ Published; Draft404 |
| Login | Login.submit → AuthContext.login → client | GET /auth/csrf; POST /auth/login | AuthController → AuthenticationManager → UserDetailsService/AccountRepository/BCrypt; lưu session | User DTO/cookie; sai401 |
| Khôi phục | AuthContext effect | GET /auth/me | SessionIdentityFilter → AuthController → CurrentAccount | Account hiện tại/401 |
| Search/page | ManagementPage.setParams → newsApi.listRecords | GET resource?keyword=&page=&size= | Controller → Service/PagePolicy → Repository | PageResponse; sort lạ400 |
| Tạo account | ManagementPage → RecordDialog accounts | POST /accounts | AccountController → AccountService.create/apply → AccountRepository | BCrypt; trùng email409; Staff403 |
| Sửa account | openEdit GET detail → RecordDialog | PUT /accounts/{id} | AccountService.update/apply/saveAndFlush/revoke | Password rỗng giữ cũ; đổi role/password thu hồi phiên |
| Xóa account | Confirm Modal → remove | DELETE /accounts/{id} | AccountService.delete → NewsRepository.existsByCreatedBy_AccountId → delete | Đã tạo tin/tự xóa409; không cascade tin |
| Tạo/sửa category | RecordDialog/allCategories | POST/PUT /categories | CategoryController → CategoryService → CategoryRepository | Chặn trùng tên, parent thiếu/chu trình |
| Xóa category | Confirm Modal | DELETE /categories/{id} | CategoryService.delete → news/child exists → repository | Có tin/con409; tự do204 |
| Tạo news/tags | RecordDialog news submit | POST /news | NewsController → NewsService.create/apply → CategoryService.find + TagRepository → NewsRepository | UUID20; creator từ session; tạo/tái dùng tag |
| Edit/Publish | openEdit GET detail → RecordDialog | PUT /news/{id} | NewsService.update/apply/saveAndFlush | Giữ creator/date; đặt updater/modifiedDate; cập nhật NewsTag |
| Xóa tin | Confirm Modal | DELETE /news/{id} | NewsService.clear tags → flush → delete | NewsTag mất; Tag giữ lại |
| History | ManagementPage news/history | GET /news/history | NewsController → NewsService.list(mine=true) → CurrentAccount → creatorID filter | Chỉ tin mình tạo |
| Profile | Profile.jsx → RecordDialog profile | GET/PUT /profile | ProfileController → AccountService.profile → CurrentAccount | DTO không có role/id; không sửa người khác |
| Logout | EditorialLayout → AuthContext.logout | POST /auth/logout + CSRF | AuthController xóa session/context/registry | user=null; Protected chuyển login |

## Mở file nào khi được hỏi

| File/nhóm | Import/dependency | Export/trách nhiệm |
| --- | --- | --- |
| main.jsx | ReactDOM/Router/App/CSS | Entry gắn App vào DOM |
| App.jsx | pages/layouts/AuthContext | default App cho main; Routes/Protected theo user/role/loading |
| context/AuthContext.jsx | hooks/api | AuthProvider/useAuth cho pages/layouts; user state và session actions |
| api/client.js | Axios | default api + errorMessage; cookie/CSRF/401/baseURL |
| api/newsApi.js | api | helpers list/get/create/update/delete/allCategories cho components |
| ManagementPage.jsx | helpers/hooks/popups | Page dùng chung; data/loading/error/editor/deleting; q/page ở URL |
| RecordDialog.jsx | API/Bootstrap | Popup controlled input, payload typed, validation, pending chống gửi trùng |
| PublicNews.jsx | api/Router/Auth | List/detail; xuất nội dung text, không chèn HTML DB |
| Login.jsx | useAuth/Router | Email/password state/pending/error; không lưu browser storage |
| Profile.jsx | useAuth/api/RecordDialog | Save cập nhật cả profile và user sidebar |
| EditorialLayout.jsx | useAuth/Outlet/NavLink | Menu theo role; Outlet hiển thị route con |
| PaginationBar.jsx | UI | Đổi trang, index bắt đầu0 |
| SecurityConfig.java | Spring Security/repos | Beans BCrypt/auth/CORS/filter; URL guard + @PreAuthorize |
| SessionIdentityFilter.java | repos/SessionRegistry | Kiểm tra session/account/role mỗi request; principal là accountID |
| controller/*.java | Service/DTO/@Valid | HTTP mapping, response/status |
| dto/*.java | Bean Validation/record | Hợp đồng input/output; giới hạn đúng SQL; không lộ hash |
| service/*.java | repos/CurrentAccount | Nghiệp vụ/transaction/map DTO; luật xóa và identity |
| repository/*.java | JpaRepository/JPQL | Entity/Page; Hibernate tạo SQL; JPQL dùng tên property Java |
| entity/*.java | JPA/@Nationalized | PK/FK/identity/sequence/lazy/ManyToMany/Unicode |
| exception/*.java | ControllerAdvice | ApiError/fieldErrors; không lộ stacktrace |
| main/resources/application.properties | env/local config | SQL Server, open-in-view=false; mapDTO trong transaction |
| test/resources/application-test.properties | H2 | create-drop chỉ test; không dùng lúc chạy app |

## Trace sâu: Staff tạo tin

**Purpose:** tạo tin + nhãn. **Input:** title/headline/content/category/status/tags. **Trigger:** Create article trong popup.

**Processing:** RecordDialog kiểm tra required, đổi categoryId sang number, tách tags bằng dấu phẩy/loại trùng. Axios lấy CSRF rồi POST JSON kèm cookie/token. Filter kiểm tra Staff/CSRF; @Valid kiểm tra DTO. NewsService.create sinh ID/date/creator từ CurrentAccount; apply kiểm tra category, tìm/tạo tag, gắn Set. saveAndFlush ghi tin và NewsTag trong transaction.

**Output:** 201 NewsResponse → onSaved đóng popup, báo thành công/reset filter/reload. Draft chỉ ở workspace.

**Failure:** input400, chưalogin401, role/CSRF403, category/tag thiếu404, xung đột409. Runtime exception rollback để không ghi nửa chừng.

**Why:** Service bảo vệ mọi client; DTO ngăn lộ mật khẩu/vòng lặp entity; Set tránh trùng; đọc quan hệ lazy trong transaction trước serialize JSON.

**Impact:** content4000→8000 cần DTO @Size, SQL column, entity @Column, FEmax, tests. Bắt buộc1tag cần validation DTO/service, UI và negative test.

## Tự tập change impact

| Đề đổi giả định | File/tầng sửa | Kiểm chứng |
| --- | --- | --- |
| Source bắt buộc | NewsRequest, RecordDialog, SQL nếu cần | thiếu400, có lưu/đọc đúng |
| Public8tin/trang | PublicNews size | >8 có Next, totalPages đúng |
| Chỉ creator sửa/xóa | NewsService so CurrentAccount/CreatedBy; UI và test2staff | Gọi thẳng API người khác403 |
| Đổi session timeout | application.properties | Chờ hết hạn; private401/UI login |
| Cấm category inactive | NewsService.apply + FEoption + tests | Gửi IDinactive trực tiếp vẫn chặn |
| Category name80 | DTO/entity/SQL/FE/tests | Ranh giới80/81ký tự |

Đây là bài luyện, chưa áp dụng các thay đổi giả định. Nói lại yêu cầu, xác định tầng ảnh hưởng, sửa tối thiểu, kiểm tra positive/negative.

## Kịch bản demo khoảng8–10phút

1. SSMS đúng DB, hai terminal; public không login, search/detail.
2. Admin popup tạo/search/sửa account; password rỗng giữ cũ. Xóa Emma đã tạo tin409; account mới chưa có tin xóa204. Giữ nguyên seed.
3. Staff popup tạo/sửa category tiếng Việt; tạo Draft2tags trong category đó.
4. Ẩn danh không thấy Draft/detail404. Publish rồi public thấy.
5. My history có tin vừa tạo; history Staff khác không có.
6. Profile sửa tên/email, F5 còn dữ liệu; không có role. DTO/session chặn ID/role giả.
7. Xóa category có tin409; xóa tin rồi category204. NewsTag mất, Tag còn.
8. git log --oneline -- ass2: scaffold → domain/security → CRUD → UI → fixes → tests/docs. Giải thích tiến trình thực tế.
9. Mở file theo bảng, trace Purpose/Input/Trigger/Processing/Output/Failure/Why/Impact; tự tập một thay đổi nhỏ.

## Rubric

- C1,1.5: bài toán/role/luật xóa/3tầng/mô hình. REQUIREMENTS.md giải thích SQL nguồn không khớp.
- C2,2.0: đúng account/repo và checkpoint thật; sốcommit không tự đảm bảo điểm. Nêu đúng phần AI hỗ trợ/phần tự kiểm tra.
- C3,1.5: đúng version chạy được; demo tích hợp public/roles/SQL và lỗi; tests/ảnh hỗ trợ.
- C4,5.0: tự mở file/trace click→SQL/chỉ state-data/lý do/change impact. App chạy không chứng minh sinh viên hiểu; cần tự thực hành bằng lời mình.

Không đảm bảo điểm10 bằng việc chạy app hay nhiềucommit; tài liệu là bản đồ để tự kiểm chứng trên code thật.
