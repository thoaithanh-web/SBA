# API contract

Base http://localhost:8084. Primary /api/orchids; alias /orchids và trailing slash base tương thích đề gốc. JSON Orchid {orchidID:number,orchidName:string,isNatural:boolean,orchidDescription:string,orchidCategory:{categoryId:number,categoryName:string},isAttractive:boolean,orchidURL:string}. Request nested category cần categoryId tồn tại; không yêu cầu categoryName.

GET list/search ?name= →200 array, kể cả empty. GET /{id} →200/404. POST →201+Location/400. PUT /{id} →200/400/404. DELETE /{id} →204 empty/404. POST luôn tạo identity mới; PUT giữ ID path. Search case-insensitive contains, trim keyword.

GET /api/categories →200 array. POST {categoryName} →201+Location,400 empty/too long,409 duplicate. DELETE /{id} →204,404 missing,409 linked orchids. Category update không thuộc phạm vi bổ sung này.

Required: orchidName 1–150 ký tự sau trim; isNatural/isAttractive boolean; orchidCategory có ID; orchidURL không rỗng <=500; description <=1000. Input validation và malformed JSON/type trả400. Missing orchid404, category reference không hợp lệ400. Error body {timestamp,status,message,path}. Không có orchids collection lồng trong category JSON.
