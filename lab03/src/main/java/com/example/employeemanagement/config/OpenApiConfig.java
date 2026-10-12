package com.example.employeemanagement.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.*;

@Configuration
public class OpenApiConfig {
  @Bean
  public OpenAPI api() {
    return new OpenAPI()
        .info(
            new Info()
                .title("EmployeeApplication")
                .version("1.0.0")
                .description("SBA301 · Lâm Thoại Thanh · CE190169 · SE1910"));
  }
}
