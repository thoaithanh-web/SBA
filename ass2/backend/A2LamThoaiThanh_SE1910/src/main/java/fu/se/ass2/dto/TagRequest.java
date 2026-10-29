// Author: Lam Thoai Thanh - CE190169
package fu.se.ass2.dto;

import jakarta.validation.constraints.*;

public record TagRequest(
    @Positive Integer tagId,
    @NotBlank @Size(max = 50) String tagName,
    @Size(max = 400) String note) {}
