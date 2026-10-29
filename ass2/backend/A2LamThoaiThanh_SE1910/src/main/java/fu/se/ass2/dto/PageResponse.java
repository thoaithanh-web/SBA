// Author: Lam Thoai Thanh - CE190169
package fu.se.ass2.dto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
public record PageResponse<T>(java.util.List<T> content,int number,int size,long totalElements,int totalPages,boolean last) { public static <T> PageResponse<T> from(org.springframework.data.domain.Page<T> p){return new PageResponse<>(p.getContent(),p.getNumber(),p.getSize(),p.getTotalElements(),p.getTotalPages(),p.isLast());}}
