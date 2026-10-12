package com.example.employeemanagement.controllers;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.employeemanagement.exceptions.ResourceNotFoundException;
import com.example.employeemanagement.pojos.Employee;
import com.example.employeemanagement.services.IEmployeeService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.*;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest({EmployeeController.class, EmployeeV2Controller.class})
class EmployeeControllerTest {
  @Autowired MockMvc mvc;
  @MockitoBean IEmployeeService service;
  Employee e = new Employee("E100", "Thanh", "Developer", 1000.0);
  String body =
      "{\"empId\":\"E100\",\"name\":\"Thanh\",\"designation\":\"Developer\",\"salary\":1000}";

  @Test
  void getDetailReturnsJson() throws Exception {
    when(service.getEmployeeById("E100")).thenReturn(e);
    mvc.perform(get("/api/employees/E100"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.empId").value("E100"));
  }

  @Test
  void getMissingReturns404() throws Exception {
    when(service.getEmployeeById("E999")).thenThrow(new ResourceNotFoundException("Missing"));
    mvc.perform(get("/api/employees/E999"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.status").value(404));
  }

  @Test
  void postReturns201AndLocation() throws Exception {
    when(service.createEmployee(any())).thenReturn(e);
    mvc.perform(post("/api/employees").contentType(MediaType.APPLICATION_JSON).content(body))
        .andExpect(status().isCreated())
        .andExpect(header().string("Location", "http://localhost/api/employees/E100"));
  }

  @Test
  void invalidPostNeverCallsService() throws Exception {
    mvc.perform(post("/api/employees").contentType(MediaType.APPLICATION_JSON).content("{}"))
        .andExpect(status().isBadRequest());
    verifyNoInteractions(service);
  }

  @Test
  void putReturnsUpdatedRecord() throws Exception {
    when(service.updateEmployee(eq("E100"), any())).thenReturn(e);
    mvc.perform(put("/api/employees/E100").contentType(MediaType.APPLICATION_JSON).content(body))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name").value("Thanh"));
  }

  @Test
  void deleteReturns204() throws Exception {
    mvc.perform(delete("/api/employees/E100"))
        .andExpect(status().isNoContent())
        .andExpect(content().string(""));
    verify(service).deleteEmployee("E100");
  }

  @Test
  void deleteMissingReturns404() throws Exception {
    doThrow(new ResourceNotFoundException("Missing")).when(service).deleteEmployee("E999");
    mvc.perform(delete("/api/employees/E999")).andExpect(status().isNotFound());
  }

  @Test
  void pageAndSortAreBound() throws Exception {
    var p = PageRequest.of(1, 2, Sort.by(Sort.Direction.DESC, "salary"));
    when(service.getAllEmployees(p)).thenReturn(new PageImpl<>(List.of(e), p, 25));
    mvc.perform(get("/api/employees?page=1&size=2&sort=salary,desc"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.number").value(1))
        .andExpect(jsonPath("$.totalElements").value(25));
    verify(service).getAllEmployees(p);
  }

  @Test
  void invalidPagingAndSortReturn400() throws Exception {
    for (String q :
        List.of("page=-1", "size=0", "size=101", "sort=unknown,asc", "sort=name,wrong", "page=abc"))
      mvc.perform(get("/api/employees?" + q)).andExpect(status().isBadRequest());
    verifyNoInteractions(service);
  }

  @Test
  void v2AddsFieldsWhileV1KeepsContract() throws Exception {
    when(service.getEmployeeById("E100")).thenReturn(e);
    mvc.perform(get("/api/v1/employees/E100")).andExpect(jsonPath("$.email").doesNotExist());
    mvc.perform(get("/api/v2/employees/E100"))
        .andExpect(jsonPath("$.email").value("e100@example.edu"))
        .andExpect(jsonPath("$.department").value("Engineering"));
  }

  @Test
  void malformedJsonReturns400() throws Exception {
    mvc.perform(post("/api/employees").contentType(MediaType.APPLICATION_JSON).content("{"))
        .andExpect(status().isBadRequest());
  }
}
