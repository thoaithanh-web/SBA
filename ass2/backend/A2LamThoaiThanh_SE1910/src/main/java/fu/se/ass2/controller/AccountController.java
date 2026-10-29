// Author: Lam Thoai Thanh - CE190169
package fu.se.ass2.controller;
import java.net.URI;
import jakarta.validation.Valid;
import fu.se.ass2.dto.*;
import fu.se.ass2.service.AccountService;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/accounts") @PreAuthorize("hasRole('ADMIN')")
public class AccountController {
 private final AccountService service;
 public AccountController(AccountService service){this.service=service;}
 @GetMapping public PageResponse<AccountResponse> list(@RequestParam(required=false) String keyword,@PageableDefault(size=10,sort="accountName") Pageable page){return PageResponse.from(service.list(keyword,page));}
 @GetMapping("/{id}") public AccountResponse get(@PathVariable short id){return service.get(id);}
 @PostMapping public ResponseEntity<AccountResponse> create(@Valid @RequestBody AccountRequest r){var c=service.create(r);return ResponseEntity.created(URI.create("/api/accounts/"+c.accountId())).body(c);}
 @PutMapping("/{id}") public AccountResponse update(@PathVariable short id,@Valid @RequestBody AccountRequest r){return service.update(id,r);}
 @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable short id){service.delete(id);return ResponseEntity.noContent().build();}
}
