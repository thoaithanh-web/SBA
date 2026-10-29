// Author: Lam Thoai Thanh - CE190169
package fu.se.ass2.dto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
public record TagResponse(Integer tagId,String tagName,String note) {}
