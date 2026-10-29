// Author: Lam Thoai Thanh - CE190169
package fu.se.ass2.controller;

import fu.se.ass2.dto.*;
import fu.se.ass2.service.NewsService;
import jakarta.validation.Valid;
import java.net.URI;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/news")
@PreAuthorize("hasRole('STAFF')")
public class NewsController {
  private final NewsService service;

  public NewsController(NewsService service) {
    this.service = service;
  }

  @GetMapping
  public PageResponse<NewsResponse> list(
      @RequestParam(required = false) String keyword,
      @PageableDefault(size = 10, sort = "createdDate", direction = Sort.Direction.DESC)
          Pageable page) {
    return PageResponse.from(service.list(keyword, false, false, page));
  }

  @GetMapping("/history")
  public PageResponse<NewsResponse> history(
      @RequestParam(required = false) String keyword,
      @PageableDefault(size = 10, sort = "createdDate", direction = Sort.Direction.DESC)
          Pageable page) {
    return PageResponse.from(service.list(keyword, false, true, page));
  }

  @GetMapping("/{id}")
  public NewsResponse get(@PathVariable String id) {
    return service.get(id, false);
  }

  @PostMapping
  public ResponseEntity<NewsResponse> create(@Valid @RequestBody NewsRequest r) {
    var n = service.create(r);
    return ResponseEntity.created(URI.create("/api/news/" + n.newsArticleId())).body(n);
  }

  @PutMapping("/{id}")
  public NewsResponse update(@PathVariable String id, @Valid @RequestBody NewsRequest r) {
    return service.update(id, r);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable String id) {
    service.delete(id);
    return ResponseEntity.noContent().build();
  }
}
