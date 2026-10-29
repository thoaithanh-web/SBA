// Author: Lam Thoai Thanh - CE190169
package fu.se.ass2.dto;

import jakarta.validation.constraints.*;

public record CategoryRequest(
    @NotBlank @Size(max = 100) String categoryName,
    @NotBlank @Size(max = 250) String categoryDescription,
    @Positive Short parentCategoryId,
    Boolean active) {}
