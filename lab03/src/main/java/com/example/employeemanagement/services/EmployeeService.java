package com.example.employeemanagement.services;

import com.example.employeemanagement.exceptions.ResourceNotFoundException;
import com.example.employeemanagement.pojos.Employee;
import com.example.employeemanagement.repositories.IEmployeeRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
public class EmployeeService implements IEmployeeService {
  private final IEmployeeRepository repository;

  public EmployeeService(IEmployeeRepository repository) {
    this.repository = repository;
  }

  private Employee clean(Employee e) {
    if (e == null
        || e.empId() == null
        || !e.empId().matches("E[0-9]{3,6}")
        || e.name() == null
        || e.name().isBlank()
        || e.name().trim().length() > 100
        || e.designation() == null
        || e.designation().isBlank()
        || e.designation().trim().length() > 80
        || e.salary() == null
        || !Double.isFinite(e.salary())
        || e.salary() < 0) throw new IllegalArgumentException("Invalid employee data");
    return new Employee(e.empId(), e.name().trim(), e.designation().trim(), e.salary());
  }

  public Page<Employee> getAllEmployees(Pageable p) {
    return repository.findAll(p);
  }

  public Slice<Employee> getSlice(Pageable p) {
    return repository.findSlice(p);
  }

  public Employee getEmployeeById(String id) {
    return repository
        .findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + id));
  }

  public Employee createEmployee(Employee e) {
    return repository.create(clean(e));
  }

  public Employee updateEmployee(String id, Employee e) {
    Employee next = clean(e);
    if (!id.equals(next.empId()))
      throw new IllegalArgumentException("Path id must match body empId");
    return repository
        .update(id, next)
        .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + id));
  }

  public void deleteEmployee(String id) {
    if (!repository.delete(id)) throw new ResourceNotFoundException("Employee not found: " + id);
  }
}
