// Author: Lam Thoai Thanh - CE190169
package fu.se.ass2.config;

import java.util.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import fu.se.ass2.dto.ApiError;
import fu.se.ass2.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.security.authentication.*;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.session.*;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.*;
import org.springframework.security.web.context.SecurityContextHolderFilter;
import org.springframework.security.web.csrf.*;
import org.springframework.web.cors.*;
@Configuration @EnableMethodSecurity
public class SecurityConfig {
 @Bean PasswordEncoder passwordEncoder(){return new BCryptPasswordEncoder();}
 @Bean SessionRegistry sessionRegistry(){return new SessionRegistryImpl();}
 @Bean UserDetailsService userDetailsService(AccountRepository accounts){return email->accounts.findByAccountEmailIgnoreCase(email.trim()).map(a->User.withUsername(a.getAccountId().toString()).password(a.getAccountPassword()).roles(a.getAccountRole()==1?"ADMIN":"STAFF").build()).orElseThrow(()->new UsernameNotFoundException("Invalid email or password"));}
 @Bean AuthenticationManager authenticationManager(UserDetailsService users,PasswordEncoder encoder){var provider=new DaoAuthenticationProvider(users);provider.setPasswordEncoder(encoder);return new ProviderManager(provider);}
 @Bean CorsConfigurationSource cors(@Value("${app.cors.origins}") String[] origins){var c=new CorsConfiguration();c.setAllowedOrigins(Arrays.asList(origins));c.setAllowCredentials(true);c.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));c.setAllowedHeaders(List.of("Content-Type","X-CSRF-TOKEN"));c.setExposedHeaders(List.of("Location"));var s=new UrlBasedCorsConfigurationSource();s.registerCorsConfiguration("/api/**",c);return s;}
 @Bean SecurityFilterChain security(HttpSecurity http,ObjectMapper json,AccountRepository accounts,SessionRegistry sessions) throws Exception {
  var csrf=new HttpSessionCsrfTokenRepository();
  http.cors(c->{}).csrf(c->c.csrfTokenRepository(csrf).csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler()))
   .authorizeHttpRequests(a->a.requestMatchers("/api/public/**","/api/auth/csrf","/api/auth/login","/error").permitAll().anyRequest().authenticated())
   .exceptionHandling(e->e.authenticationEntryPoint((req,res,ex)->{res.setStatus(401);res.setContentType("application/json");json.writeValue(res.getOutputStream(),new ApiError("UNAUTHENTICATED","Please sign in to continue",java.time.Instant.now(),Map.of()));})
    .accessDeniedHandler((req,res,ex)->{res.setStatus(403);res.setContentType("application/json");json.writeValue(res.getOutputStream(),new ApiError("FORBIDDEN","This action is not allowed for your role or the CSRF token is invalid",java.time.Instant.now(),Map.of()));}))
   .formLogin(c->c.disable()).httpBasic(c->c.disable()).logout(c->c.disable())
   .addFilterAfter(new SessionIdentityFilter(accounts,sessions),SecurityContextHolderFilter.class);
  return http.build();
 }
}
