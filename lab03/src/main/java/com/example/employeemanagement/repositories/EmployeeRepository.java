package com.example.employeemanagement.repositories;

import com.example.employeemanagement.exceptions.ConflictException;
import com.example.employeemanagement.pojos.Employee;
import java.util.*;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Repository;

@Repository
public class EmployeeRepository implements IEmployeeRepository {
  private final Map<String, Employee> employees = new LinkedHashMap<>();

  public EmployeeRepository() {
    for (int i = 1; i <= 25; i++) {
      String id = "E%03d".formatted(i);
      employees.put(
          id,
          new Employee(
              id,
              "Employee %02d".formatted(i),
              i % 2 == 0 ? "Tester" : "Developer",
              10000000.0 + i * 500000));
    }
  }

  private List<Employee> sorted(Pageable p) {
    Comparator<Employee> comparator = (a, b) -> 0;
    for (Sort.Order order : p.getSort()) {
      Comparator<Employee> next =
          switch (order.getProperty()) {
            case "empId" -> Comparator.comparing(Employee::empId);
            case "name" -> Comparator.comparing(Employee::name, String.CASE_INSENSITIVE_ORDER);
            case "designation" ->
                Comparator.comparing(Employee::designation, String.CASE_INSENSITIVE_ORDER);
            case "salary" -> Comparator.comparing(Employee::salary);
            default -> throw new IllegalArgumentException("Unsupported sort field");
          };
      comparator = comparator.thenComparing(order.isAscending() ? next : next.reversed());
    }
    return employees.values().stream().sorted(comparator.thenComparing(Employee::empId)).toList();
  }

  public synchronized Page<Employee> findAll(Pageable p) {
    List<Employee> all = sorted(p);
    int start = (int) Math.min(p.getOffset(), all.size());
    return new PageImpl<>(
        all.subList(start, Math.min(start + p.getPageSize(), all.size())), p, all.size());
  }

  public synchronized Slice<Employee> findSlice(Pageable p) {
    List<Employee> all = sorted(p);
    int start = (int) Math.min(p.getOffset(), all.size());
    List<Employee> window = all.subList(start, Math.min(start + p.getPageSize() + 1, all.size()));
    boolean next = window.size() > p.getPageSize();
    return new SliceImpl<>(window.subList(0, Math.min(window.size(), p.getPageSize())), p, next);
  }

  public synchronized Optional<Employee> findById(String id) {
    return Optional.ofNullable(employees.get(id));
  }

  public synchronized Employee create(Employee e) {
    if (employees.containsKey(e.empId()))
      throw new ConflictException("Employee already exists: " + e.empId());
    employees.put(e.empId(), e);
    return e;
  }

  public synchronized Optional<Employee> update(String id, Employee e) {
    if (!employees.containsKey(id)) return Optional.empty();
    employees.put(id, e);
    return Optional.of(e);
  }

  public synchronized boolean delete(String id) {
    return employees.remove(id) != null;
  }
}
