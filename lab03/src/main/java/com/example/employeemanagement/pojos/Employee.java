package com.example.employeemanagement.pojos;

import jakarta.validation.constraints.*;

public record Employee(
    @NotBlank @Pattern(regexp = "E[0-9]{3,6}") String empId,
    @NotBlank @Size(max = 100) String name,
    @NotBlank @Size(max = 80) String designation,
    @NotNull @PositiveOrZero Double salary) {}
