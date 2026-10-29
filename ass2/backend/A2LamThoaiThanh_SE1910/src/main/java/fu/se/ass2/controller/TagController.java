// Author: Lam Thoai Thanh - CE190169
package fu.se.ass2.controller;

import fu.se.ass2.dto.TagResponse;
import fu.se.ass2.service.NewsService;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tags")
@PreAuthorize("hasRole('STAFF')")
public class TagController {
  private final NewsService service;

  public TagController(NewsService service) {
    this.service = service;
  }

  @GetMapping
  public List<TagResponse> list() {
    return service.tags();
  }
}
