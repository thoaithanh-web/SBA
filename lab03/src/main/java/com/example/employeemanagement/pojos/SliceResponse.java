package com.example.employeemanagement.pojos;

import java.util.List;
import org.springframework.data.domain.Slice;

public record SliceResponse<T>(
    List<T> content, int number, int size, boolean hasNext, boolean first, boolean last) {
  public static <T> SliceResponse<T> from(Slice<T> s) {
    return new SliceResponse<>(
        s.getContent(), s.getNumber(), s.getSize(), s.hasNext(), s.isFirst(), s.isLast());
  }
}
