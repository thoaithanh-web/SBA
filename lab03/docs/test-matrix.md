# Test matrix · 12/10/2026

Windows, JDK21.0.8, Maven3.9.12, Spring Boot3.5.16.

| Boundary | Cases/assertions | Actual |
| --- | --- | --- |
| Controller | GET JSON, missing404, POST201/Location, invalid400, PUT200, DELETE204/missing404, paging/sort binding, invalid params, v1/v2, malformed JSON | 11 PASS |
| Service | trim/delegation, negative/nonfinite salary, missing, mismatched ID, missing delete | 6 PASS |
| Repository | CRUD round trip, duplicate preserves record, disjoint pages/totals, salary desc, Slice next/last, out-of-range empty, missing mutations | 7 PASS |
| Full context | real seeded paging/sort, Slice no totals, Swagger/OpenAPI available | 3 PASS |
| Live HTTP | Postman collection via Newman, CRUD postconditions and errors | 11 requests/assertions PASS |

JUnit total27, failures0/errors0/skipped0. Live HTTP evidence: evidence/api-results.json. Test run summaries: evidence/console/tests-green.txt. Build: mvn clean verify PASS. Human Gate không được tự đánh dấu bằng test tự động.
