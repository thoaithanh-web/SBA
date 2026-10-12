package com.example.employeemanagement.repositories;

import static org.assertj.core.api.Assertions.*;

import com.example.employeemanagement.exceptions.ConflictException;
import com.example.employeemanagement.pojos.Employee;
import org.junit.jupiter.api.*;
import org.springframework.data.domain.*;

class EmployeeRepositoryTest {
  EmployeeRepository repo;

  @BeforeEach
  void setup() {
    repo = new EmployeeRepository();
  }

  @Test
  void createFindUpdateDeleteRoundTrip() {
    var e = new Employee("E100", "Test", "Developer", 1.0);
    repo.create(e);
    assertThat(repo.findById("E100")).contains(e);
    var changed = new Employee("E100", "Changed", "Tester", 2.0);
    assertThat(repo.update("E100", changed)).contains(changed);
    assertThat(repo.delete("E100")).isTrue();
    assertThat(repo.findById("E100")).isEmpty();
  }

  @Test
  void duplicateCreatePreservesOriginal() {
    var old = repo.findById("E001").orElseThrow();
    assertThatThrownBy(() -> repo.create(new Employee("E001", "Other", "HR", 0.0)))
        .isInstanceOf(ConflictException.class);
    assertThat(repo.findById("E001")).contains(old);
  }

  @Test
  void pageMetadataAndDisjointWindows() {
    var a = repo.findAll(PageRequest.of(0, 10, Sort.by("empId")));
    var b = repo.findAll(PageRequest.of(1, 10, Sort.by("empId")));
    assertThat(a.getTotalElements()).isEqualTo(25);
    assertThat(a.getTotalPages()).isEqualTo(3);
    assertThat(a.getContent()).doesNotContainAnyElementsOf(b.getContent());
  }

  @Test
  void sortSalaryDescending() {
    var p = repo.findAll(PageRequest.of(0, 3, Sort.by(Sort.Direction.DESC, "salary")));
    assertThat(p.getContent()).extracting(Employee::empId).containsExactly("E025", "E024", "E023");
  }

  @Test
  void sliceHasNextWithoutTotalMetadata() {
    var a = repo.findSlice(PageRequest.of(0, 10));
    var last = repo.findSlice(PageRequest.of(2, 10));
    assertThat(a.hasNext()).isTrue();
    assertThat(last.hasNext()).isFalse();
    assertThat(last.getContent()).hasSize(5);
  }

  @Test
  void beyondLastPageIsEmpty() {
    assertThat(repo.findAll(PageRequest.of(100, 10)).getContent()).isEmpty();
  }

  @Test
  void missingUpdateAndDeleteDoNotCreate() {
    assertThat(repo.update("E999", new Employee("E999", "A", "B", 0.0))).isEmpty();
    assertThat(repo.delete("E999")).isFalse();
  }
}
