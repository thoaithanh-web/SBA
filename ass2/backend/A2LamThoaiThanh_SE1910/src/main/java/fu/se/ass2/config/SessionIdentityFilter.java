// Author: Lam Thoai Thanh - CE190169
package fu.se.ass2.config;

import java.io.IOException;
import fu.se.ass2.repository.AccountRepository;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.web.filter.OncePerRequestFilter;
public class SessionIdentityFilter extends OncePerRequestFilter {
 private final AccountRepository accounts;private final SessionRegistry sessions;
 public SessionIdentityFilter(AccountRepository accounts,SessionRegistry sessions){this.accounts=accounts;this.sessions=sessions;}
 @Override protected void doFilterInternal(HttpServletRequest req,HttpServletResponse res,FilterChain chain)throws ServletException,IOException{
  var auth=SecurityContextHolder.getContext().getAuthentication();
  if(auth!=null&&auth.isAuthenticated()&&!"anonymousUser".equals(auth.getPrincipal())){
   var session=req.getSession(false);var info=session==null?null:sessions.getSessionInformation(session.getId());
   var account=accounts.findById(Short.valueOf(auth.getName()));
   if(account.isEmpty()||(info!=null&&info.isExpired())){if(session!=null)session.invalidate();SecurityContextHolder.clearContext();}
   else {var a=account.get();var next=new UsernamePasswordAuthenticationToken(auth.getPrincipal(),null,AuthorityUtils.createAuthorityList(a.getAccountRole()==1?"ROLE_ADMIN":"ROLE_STAFF"));SecurityContextHolder.getContext().setAuthentication(next);}
  }
  chain.doFilter(req,res);
 }
}
