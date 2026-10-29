// Author: Lam Thoai Thanh - CE190169
package fu.se.ass2.dto;

import jakarta.validation.constraints.*;

public record LoginRequest(
    @NotBlank @Email @Size(max = 70) String email, @NotBlank @Size(max = 64) String password) {}
