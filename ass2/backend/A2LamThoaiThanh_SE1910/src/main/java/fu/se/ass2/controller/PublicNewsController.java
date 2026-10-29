// Author: Lam Thoai Thanh - CE190169
package fu.se.ass2.controller;

import fu.se.ass2.dto.*;
import fu.se.ass2.service.NewsService;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/news")
public class PublicNewsController {
  private final NewsService service;

  public PublicNewsController(NewsService service) {
    this.service = service;
  }

  @GetMapping
  public PageResponse<NewsResponse> list(
      @RequestParam(required = false) String keyword,
      @PageableDefault(size = 6, sort = "createdDate", direction = Sort.Direction.DESC)
          Pageable page) {
    return PageResponse.from(service.list(keyword, true, false, page));
  }

  @GetMapping("/{id}")
  public NewsResponse get(@PathVariable String id) {
    return service.get(id, true);
  }
}
