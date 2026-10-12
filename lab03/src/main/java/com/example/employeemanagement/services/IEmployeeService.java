package com.example.employeemanagement.services;

import com.example.employeemanagement.pojos.Employee;
import org.springframework.data.domain.*;

public interface IEmployeeService {
  Page<Employee> getAllEmployees(Pageable p);

  Slice<Employee> getSlice(Pageable p);

  Employee getEmployeeById(String id);

  Employee createEmployee(Employee e);

  Employee updateEmployee(String id, Employee e);

  void deleteEmployee(String id);
}
