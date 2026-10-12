# Test matrix · 12/10/2026

Windows, JDK21.0.8, Maven3.9.12, SQL Server2022 (16.0). Unit/web slice14 và SQL integration9, tổng23 PASS, không skip trong lượt đầy đủ. Khi không bật SQLSERVER_TESTS, chín integration tests được skip có chủ đích; không được ghi lượt đó là full verification.

| ID | Scenario | Expected / actual | Evidence |
| --- | --- | --- | --- |
| T01 | GET list | 200 array | api-results.json |
| T02 | Search name | 200, tên match không phân biệt hoa/thường | api-results.json + SQL integration |
| T03 | GET detail | 200 đúng record | api-results.json |
| T04 | GET missing/deleted | 404 | api-results.json |
| T05 | POST category + orchid | 201+Location, FK tới category thật | api-results.json + schema.txt |
| T06 | POST category missing | 400, row count không đổi | break-it-http.json + SQL test |
| T07 | PUT existing | 200, DB name/FK cập nhật | api-results.json + SQL test |
| T08 | PUT missing | 404 | bổ sung live negative requests |
| T09 | DELETE existing | 204, GET sau đó404 | api-results.json |
| T10 | DELETE missing | 404 | bổ sung live negative requests |
| T11 | Category còn orchid | 409, category giữ nguyên | api-results.json |
| T12 | Blank/invalid/malformed/type | 400 | MockMvc + break-it-http.json |
| T13 | SQL engine/schema/FK | SQL Server thật, FK tồn tại | SQL integration + sqlserver/schema.txt |
| T14 | JSON recursion | Không có category.orchids | SQL integration |
| T15 | Restart | Record vẫn còn sau restart JAR | persistence.json |
| T16 | Swagger | HTTP200 và paths khớp controller | SQL integration |

Postman collection đã chạy qua Newman, không qua Postman GUI. SQL evidence thu bằng sqlcmd; tests gọi SQL trực tiếp để đối chiếu sau save/update. Full test summary trong console/tests-green.txt. B1/B5/B6/B7 được thực hiện; xem debug-log.md.
