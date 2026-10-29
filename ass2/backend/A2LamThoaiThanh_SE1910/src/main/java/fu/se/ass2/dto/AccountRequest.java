// Author: Lam Thoai Thanh - CE190169
package fu.se.ass2.dto;

import jakarta.validation.constraints.*;

public record AccountRequest(
    @NotBlank @Size(max = 100) String accountName,
    @NotBlank @Email @Size(max = 70) String accountEmail,
    @NotNull @Min(1) @Max(2) Integer accountRole,
    @Size(max = 64) String password) {}
