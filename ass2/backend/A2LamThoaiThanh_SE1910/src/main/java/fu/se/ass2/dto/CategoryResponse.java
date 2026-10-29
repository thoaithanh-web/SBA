// Author: Lam Thoai Thanh - CE190169
package fu.se.ass2.dto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
public record CategoryResponse(Short categoryId,String categoryName,String categoryDescription,Short parentCategoryId,Boolean active) {}
