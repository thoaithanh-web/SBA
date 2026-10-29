// Author: Lam Thoai Thanh - CE190169
package fu.se.ass2.controller;

import fu.se.ass2.dto.*;
import fu.se.ass2.service.*;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@PreAuthorize("hasRole('STAFF')")
public class ProfileController {
  private final AccountService service;
  private final CurrentAccount current;

  public ProfileController(AccountService service, CurrentAccount current) {
    this.service = service;
    this.current = current;
  }

  @GetMapping
  public AccountResponse get() {
    return service.get(current.get().getAccountId());
  }

  @PutMapping
  public AccountResponse update(@Valid @RequestBody ProfileRequest request) {
    return service.profile(request);
  }
}
