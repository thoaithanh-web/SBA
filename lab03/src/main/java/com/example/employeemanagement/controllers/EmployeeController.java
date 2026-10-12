package com.example.employeemanagement.controllers;

import com.example.employeemanagement.exceptions.ApiError;
import com.example.employeemanagement.pojos.*;
import com.example.employeemanagement.services.IEmployeeService;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping({"/api/employees", "/api/v1/employees"})
public class EmployeeController {
  private final IEmployeeService service;

  public EmployeeController(IEmployeeService service) {
    this.service = service;
  }

  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Success"),
    @ApiResponse(
        responseCode = "400",
        description = "Invalid request",
        content = @Content(schema = @Schema(implementation = ApiError.class)))
  })
  @GetMapping
  public PageResponse<Employee> list(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(defaultValue = "empId,asc") String sort) {
    return PageResponse.from(service.getAllEmployees(Paging.of(page, size, sort)));
  }

  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Success"),
    @ApiResponse(
        responseCode = "400",
        description = "Invalid request",
        content = @Content(schema = @Schema(implementation = ApiError.class)))
  })
  @GetMapping("/slice")
  public SliceResponse<Employee> slice(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(defaultValue = "empId,asc") String sort) {
    return SliceResponse.from(service.getSlice(Paging.of(page, size, sort)));
  }

  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Success"),
    @ApiResponse(
        responseCode = "404",
        description = "Resource not found",
        content = @Content(schema = @Schema(implementation = ApiError.class)))
  })
  @GetMapping("/{id}")
  public Employee detail(@PathVariable String id) {
    return service.getEmployeeById(id);
  }

  @ApiResponses({
    @ApiResponse(responseCode = "201", description = "Created with Location header"),
    @ApiResponse(
        responseCode = "400",
        description = "Invalid request",
        content = @Content(schema = @Schema(implementation = ApiError.class))),
    @ApiResponse(
        responseCode = "409",
        description = "Conflicting record or relationship",
        content = @Content(schema = @Schema(implementation = ApiError.class)))
  })
  @PostMapping
  public ResponseEntity<Employee> create(@Valid @RequestBody Employee input) {
    Employee e = service.createEmployee(input);
    return ResponseEntity.created(
            ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(e.empId())
                .toUri())
        .body(e);
  }

  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Success"),
    @ApiResponse(
        responseCode = "400",
        description = "Invalid request",
        content = @Content(schema = @Schema(implementation = ApiError.class))),
    @ApiResponse(
        responseCode = "404",
        description = "Resource not found",
        content = @Content(schema = @Schema(implementation = ApiError.class)))
  })
  @PutMapping("/{id}")
  public Employee update(@PathVariable String id, @Valid @RequestBody Employee input) {
    return service.updateEmployee(id, input);
  }

  @ApiResponses({
    @ApiResponse(responseCode = "204", description = "Deleted with empty body"),
    @ApiResponse(
        responseCode = "404",
        description = "Resource not found",
        content = @Content(schema = @Schema(implementation = ApiError.class)))
  })
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable String id) {
    service.deleteEmployee(id);
    return ResponseEntity.noContent().build();
  }
}
