package com.example.orchid.exceptions;

import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import org.springframework.http.*;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@RestControllerAdvice
public class GlobalExceptionHandler {
  private ResponseEntity<ApiError> error(
      HttpStatus status, String message, HttpServletRequest request) {
    return ResponseEntity.status(status)
        .body(new ApiError(Instant.now(), status.value(), message, request.getRequestURI()));
  }

  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<ApiError> missing(ResourceNotFoundException e, HttpServletRequest r) {
    return error(HttpStatus.NOT_FOUND, e.getMessage(), r);
  }

  @ExceptionHandler(ConflictException.class)
  public ResponseEntity<ApiError> conflict(ConflictException e, HttpServletRequest r) {
    return error(HttpStatus.CONFLICT, e.getMessage(), r);
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ApiError> invalid(IllegalArgumentException e, HttpServletRequest r) {
    return error(HttpStatus.BAD_REQUEST, e.getMessage(), r);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiError> validation(
      MethodArgumentNotValidException e, HttpServletRequest r) {
    String message =
        e.getBindingResult().getFieldErrors().stream()
            .map(f -> f.getField() + ": " + f.getDefaultMessage())
            .sorted()
            .reduce((a, b) -> a + "; " + b)
            .orElse("Invalid request");
    return error(HttpStatus.BAD_REQUEST, message, r);
  }

  @ExceptionHandler({
    HttpMessageNotReadableException.class,
    MethodArgumentTypeMismatchException.class
  })
  public ResponseEntity<ApiError> malformed(Exception e, HttpServletRequest r) {
    return error(HttpStatus.BAD_REQUEST, "Malformed JSON or invalid parameter type", r);
  }
}
