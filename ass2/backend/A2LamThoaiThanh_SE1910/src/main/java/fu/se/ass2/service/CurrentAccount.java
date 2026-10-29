// Author: Lam Thoai Thanh - CE190169
package fu.se.ass2.service;

import fu.se.ass2.entity.SystemAccount;
import fu.se.ass2.exception.DomainException;
import fu.se.ass2.repository.AccountRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class CurrentAccount {
  private final AccountRepository accounts;

  public CurrentAccount(AccountRepository accounts) {
    this.accounts = accounts;
  }

  public SystemAccount get() {
    var auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !auth.isAuthenticated()) throw new DomainException(401, "Please sign in");
    return accounts
        .findById(Short.valueOf(auth.getName()))
        .orElseThrow(() -> new DomainException(401, "Account no longer exists"));
  }
}
