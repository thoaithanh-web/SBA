// Author: Lam Thoai Thanh - CE190169
package fu.se.ass2.exception;

import java.time.Instant;
import java.util.*;
import fu.se.ass2.dto.ApiError;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
@RestControllerAdvice
public class ApiExceptionHandler {
 @ExceptionHandler(DomainException.class) ResponseEntity<ApiError> domain(DomainException e){return error(e.status(),e.getMessage(),Map.of());}
 @ExceptionHandler(MethodArgumentNotValidException.class) ResponseEntity<ApiError> validation(MethodArgumentNotValidException e){Map<String,String> fields=new LinkedHashMap<>();e.getBindingResult().getFieldErrors().forEach(f->fields.putIfAbsent(f.getField(),f.getDefaultMessage()));return error(400,"Please check the form fields",fields);}
 @ExceptionHandler({HttpMessageNotReadableException.class,MethodArgumentTypeMismatchException.class}) ResponseEntity<ApiError> badBody(Exception e){return error(400,"Invalid JSON or parameter type",Map.of());}
 @ExceptionHandler(DataIntegrityViolationException.class) ResponseEntity<ApiError> integrity(Exception e){return error(409,"Duplicate data or an existing relationship prevents this change",Map.of());}
 private ResponseEntity<ApiError> error(int status,String message,Map<String,String> fields){return ResponseEntity.status(status).body(new ApiError(status==404?"NOT_FOUND":status==409?"CONFLICT":"INVALID_REQUEST",message,Instant.now(),fields));}
}
