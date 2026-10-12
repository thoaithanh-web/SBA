package com.example.employeemanagement;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class EmployeeIntegrationTest {
  @Autowired MockMvc mvc;

  @Test
  void realWiringPagesAndSortsSeed() throws Exception {
    mvc.perform(get("/api/employees?size=2&sort=salary,desc"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content[0].empId").value("E025"))
        .andExpect(jsonPath("$.totalElements").value(25));
  }

  @Test
  void sliceDoesNotExposeTotals() throws Exception {
    mvc.perform(get("/api/employees/slice?size=10"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.hasNext").value(true))
        .andExpect(jsonPath("$.totalElements").doesNotExist());
  }

  @Test
  void openApiAndSwaggerAreAvailable() throws Exception {
    mvc.perform(get("/v3/api-docs"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.paths['/api/employees']").exists())
        .andExpect(jsonPath("$.paths['/api/employees'].post.responses['201']").exists());
    mvc.perform(get("/swagger-ui/index.html")).andExpect(status().isOk());
  }
}
