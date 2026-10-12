# API contract

Base http://localhost:8083. JSON. API v1/base: Employee {empId:string,name:string,designation:string,salary:number}. V2 thêm email:string,department:string chỉ trong GET representation. V2 email/department là demo derived values.

Page: {content,number,size,totalElements,totalPages,first,last}; Slice: {content,number,size,hasNext,first,last}. Page index0; size1–100; sort=empId|name|designation|salary,asc|desc. Unsupported sort/size/page/type trả400.

GET /api/employees hoặc /api/v1/employees →200 Page; GET /slice →200 Slice. GET /{id} →200/404. POST →201+Location,400 validation,409 duplicate. PUT /{id} →200,400 validation/ID mismatch,404 missing. DELETE /{id} →204 empty body hoặc404. GET /api/v2/employees[/{id}] →200/400/404 theo list/detail.

Errors: {timestamp:ISO8601,status:number,message:string,path:string}. Malformed JSON trả400. Không gửi body cho204. POST/PUT body đủ bốn fields, không có generated ID. Theo dõi source thực tế và OpenAPI /v3/api-docs; Postman collection kiểm chứng status.
