# Debug and regression

## Missing employee: red to green

Intentionally changed GlobalExceptionHandler from NOT_FOUND to OK for ResourceNotFoundException. EmployeeControllerTest#getMissingReturns404 failed with expected404/actual200. Evidence: console/regression-red.txt. Restored404, reran the same test successfully: console/regression-green.txt. The final full suite passes27 tests. The mutation is absent from the final source.

## Windows JAR lock

Running clean while the packaged JAR was executing prevented deletion of target/*.jar. Stopped only the lab application process and reran clean verify successfully. README asks users to stop the app before clean.

## PowerShell argument splatting

The Run switch initially returned a scalar string; splatting @mavenArgs expanded spring-boot:run into characters, causing Maven NoSuchElementException. Declaring [string[]]$mavenArgs preserves a single argument. Tested Run separately after the fix; both backend scripts start successfully. Package/test already produced arrays with two arguments and were unaffected.
