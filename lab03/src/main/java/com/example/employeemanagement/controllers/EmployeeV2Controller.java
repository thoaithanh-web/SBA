package com.example.employeemanagement.controllers;

import com.example.employeemanagement.exceptions.ApiError;
import com.example.employeemanagement.pojos.*;
import com.example.employeemanagement.services.IEmployeeService;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v2/employees")
public class EmployeeV2Controller {
  private final IEmployeeService service;

  public EmployeeV2Controller(IEmployeeService service) {
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
  public PageResponse<EmployeeV2> list(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(defaultValue = "empId,asc") String sort) {
    return PageResponse.from(
        service.getAllEmployees(Paging.of(page, size, sort)).map(EmployeeV2::from));
  }

  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Success"),
    @ApiResponse(
        responseCode = "404",
        description = "Resource not found",
        content = @Content(schema = @Schema(implementation = ApiError.class)))
  })
  @GetMapping("/{id}")
  public EmployeeV2 detail(@PathVariable String id) {
    return EmployeeV2.from(service.getEmployeeById(id));
  }
}
