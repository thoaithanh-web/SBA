// Author: Lam Thoai Thanh - CE190169
package fu.se.ass2.controller;

import fu.se.ass2.dto.*;
import fu.se.ass2.exception.DomainException;
import fu.se.ass2.service.CurrentAccount;
import jakarta.servlet.http.*;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.security.authentication.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private final AuthenticationManager manager;
  private final CurrentAccount current;
  private final SessionRegistry sessions;

  public AuthController(
      AuthenticationManager manager, CurrentAccount current, SessionRegistry sessions) {
    this.manager = manager;
    this.current = current;
    this.sessions = sessions;
  }

  @GetMapping("/csrf")
  public Map<String, String> csrf(CsrfToken token) {
    return Map.of("token", token.getToken(), "headerName", token.getHeaderName());
  }

  @PostMapping("/login")
  public AccountResponse login(
      @Valid @RequestBody LoginRequest request, HttpServletRequest req, HttpServletResponse res) {
    try {
      var authentication =
          manager.authenticate(
              UsernamePasswordAuthenticationToken.unauthenticated(
                  request.email(), request.password()));
      if (req.getSession(false) != null) req.changeSessionId();
      var context = SecurityContextHolder.createEmptyContext();
      context.setAuthentication(authentication);
      SecurityContextHolder.setContext(context);
      new HttpSessionSecurityContextRepository().saveContext(context, req, res);
      sessions.registerNewSession(req.getSession().getId(), authentication.getPrincipal());
      return me();
    } catch (org.springframework.security.core.AuthenticationException e) {
      throw new DomainException(401, "Incorrect email or password");
    }
  }

  @GetMapping("/me")
  public AccountResponse me() {
    var a = current.get();
    return new AccountResponse(
        a.getAccountId(), a.getAccountName(), a.getAccountEmail(), a.getAccountRole());
  }

  @PostMapping("/logout")
  public void logout(HttpServletRequest req) {
    var session = req.getSession(false);
    if (session != null) {
      sessions.removeSessionInformation(session.getId());
      session.invalidate();
    }
    SecurityContextHolder.clearContext();
  }
}
