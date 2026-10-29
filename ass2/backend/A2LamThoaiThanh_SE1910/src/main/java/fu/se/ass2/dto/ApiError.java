// Author: Lam Thoai Thanh - CE190169
package fu.se.ass2.dto;

import jakarta.validation.constraints.*;

public record ApiError(
    String code,
    String message,
    java.time.Instant timestamp,
    java.util.Map<String, String> fieldErrors) {}
