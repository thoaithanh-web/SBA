// Author: Lam Thoai Thanh - CE190169
package fu.se.ass2.dto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
public record NewsRequest(@NotBlank @Size(max=400) String newsTitle,@NotBlank @Size(max=150) String headline,@NotBlank @Size(max=4000) String newsContent,@Size(max=400) String newsSource,@NotNull @Positive Short categoryId,Boolean newsStatus,@Size(max=12) java.util.List<@Valid TagRequest> tags) {}
