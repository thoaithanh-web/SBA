package com.example.employeemanagement.repositories;

import com.example.employeemanagement.pojos.Employee;
import java.util.Optional;
import org.springframework.data.domain.*;

public interface IEmployeeRepository {
  Page<Employee> findAll(Pageable pageable);

  Slice<Employee> findSlice(Pageable pageable);

  Optional<Employee> findById(String id);

  Employee create(Employee employee);

  Optional<Employee> update(String id, Employee employee);

  boolean delete(String id);
}
