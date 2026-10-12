package com.example.employeemanagement.pojos;

public record EmployeeV2(
    String empId, String name, String designation, Double salary, String email, String department) {
  public static EmployeeV2 from(Employee e) {
    return new EmployeeV2(
        e.empId(),
        e.name(),
        e.designation(),
        e.salary(),
        e.empId().toLowerCase() + "@example.edu",
        e.designation().equals("Developer") ? "Engineering" : "Operations");
  }
}
