// Author: Lam Thoai Thanh - CE190169
package fu.se.ass2.controller;
import java.net.URI;
import jakarta.validation.Valid;
import fu.se.ass2.dto.*;
import fu.se.ass2.service.CategoryService;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/categories") @PreAuthorize("hasRole('STAFF')")
public class CategoryController {
 private final CategoryService service;
 public CategoryController(CategoryService service){this.service=service;}
 @GetMapping public PageResponse<CategoryResponse> list(@RequestParam(required=false) String keyword,@PageableDefault(size=10,sort="categoryName") Pageable page){return PageResponse.from(service.list(keyword,page));}
 @GetMapping("/{id}") public CategoryResponse get(@PathVariable short id){return service.get(id);}
 @PostMapping public ResponseEntity<CategoryResponse> create(@Valid @RequestBody CategoryRequest r){var c=service.create(r);return ResponseEntity.created(URI.create("/api/categories/"+c.categoryId())).body(c);}
 @PutMapping("/{id}") public CategoryResponse update(@PathVariable short id,@Valid @RequestBody CategoryRequest r){return service.update(id,r);}
 @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable short id){service.delete(id);return ResponseEntity.noContent().build();}
}
