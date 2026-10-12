package com.example.employeemanagement.services;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.example.employeemanagement.exceptions.ResourceNotFoundException;
import com.example.employeemanagement.pojos.Employee;
import com.example.employeemanagement.repositories.IEmployeeRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {
  @Mock IEmployeeRepository repository;
  @InjectMocks EmployeeService service;

  @Test
  void validCreateNormalizesAndDelegates() {
    var clean = new Employee("E100", "Thanh", "Developer", 0.0);
    when(repository.create(clean)).thenReturn(clean);
    assertThat(service.createEmployee(new Employee("E100", " Thanh ", " Developer ", 0.0)))
        .isEqualTo(clean);
    verify(repository).create(clean);
  }

  @Test
  void negativeSalaryNeverWrites() {
    assertThatThrownBy(() -> service.createEmployee(new Employee("E100", "A", "B", -1.0)))
        .isInstanceOf(IllegalArgumentException.class);
    verifyNoInteractions(repository);
  }

  @Test
  void missingEmployeeThrows404DomainException() {
    when(repository.findById("E999")).thenReturn(Optional.empty());
    assertThatThrownBy(() -> service.getEmployeeById("E999"))
        .isInstanceOf(ResourceNotFoundException.class);
  }

  @Test
  void mismatchedIdNeverWrites() {
    assertThatThrownBy(() -> service.updateEmployee("E101", new Employee("E100", "A", "B", 0.0)))
        .isInstanceOf(IllegalArgumentException.class);
    verifyNoInteractions(repository);
  }

  @Test
  void missingDeleteThrows() {
    when(repository.delete("E999")).thenReturn(false);
    assertThatThrownBy(() -> service.deleteEmployee("E999"))
        .isInstanceOf(ResourceNotFoundException.class);
  }

  @Test
  void nonFiniteSalaryIsInvalid() {
    assertThatThrownBy(() -> service.createEmployee(new Employee("E100", "A", "B", Double.NaN)))
        .isInstanceOf(IllegalArgumentException.class);
  }
}
