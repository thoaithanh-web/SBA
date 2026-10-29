// Author: Lam Thoai Thanh - CE190169
package fu.se.ass2.dto;

import jakarta.validation.constraints.*;

public record NewsResponse(
    String newsArticleId,
    String newsTitle,
    String headline,
    String newsContent,
    String newsSource,
    Short categoryId,
    String categoryName,
    Boolean newsStatus,
    Short createdById,
    String authorName,
    Short updatedById,
    java.time.LocalDateTime createdDate,
    java.time.LocalDateTime modifiedDate,
    java.util.List<TagResponse> tags) {}
