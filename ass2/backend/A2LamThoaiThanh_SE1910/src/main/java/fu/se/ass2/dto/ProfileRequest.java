// Author: Lam Thoai Thanh - CE190169
package fu.se.ass2.dto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
public record ProfileRequest(@NotBlank @Size(max=100) String accountName,@NotBlank @Email @Size(max=70) String accountEmail,@Size(max=64) String password) {}
