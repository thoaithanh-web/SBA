package com.example.employeemanagement.controllers;

import java.util.Set;
import org.springframework.data.domain.*;

public final class Paging {
  private Paging() {}

  public static Pageable of(int page, int size, String sort) {
    if (page < 0 || size < 1 || size > 100)
      throw new IllegalArgumentException("page must be >= 0 and size between 1 and 100");
    String[] parts = sort.split(",", -1);
    if (parts.length != 2
        || !Set.of("empId", "name", "designation", "salary").contains(parts[0])
        || !Set.of("asc", "desc").contains(parts[1]))
      throw new IllegalArgumentException("sort must be empId/name/designation/salary,asc/desc");
    return PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(parts[1]), parts[0]));
  }
}
