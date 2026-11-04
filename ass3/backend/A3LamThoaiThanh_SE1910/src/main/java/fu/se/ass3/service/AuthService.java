// Author: Lam Thoai Thanh - CE190169

package fu.se.ass3.service;

import fu.se.ass3.config.SecurityConfig;
import fu.se.ass3.dto.HotelDtos.*;
import fu.se.ass3.repository.CustomerRepository;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private final CustomerRepository customers;
    private final PasswordEncoder passwords;
    private final JwtEncoder tokens;
    private final String staffEmail;
    private final String staffHash;
    private final String dummyHash;

    public AuthService(CustomerRepository customers, PasswordEncoder passwords, JwtEncoder tokens,
                       @Value("${app.staff.email}") String staffEmail,
                       @Value("${app.staff.password}") String staffPassword) {
        this.customers = customers;
        this.passwords = passwords;
        this.tokens = tokens;
        this.staffEmail = staffEmail;
        this.staffHash = staffPassword.isBlank() ? null : passwords.encode(staffPassword);
        this.dummyHash = passwords.encode(java.util.UUID.randomUUID().toString());
    }

    public Session login(Login input) {
        if (input.password().getBytes(StandardCharsets.UTF_8).length > 72) {
            throw invalid();
        }
        if (staffEmail.equalsIgnoreCase(input.email())) {
            if (staffHash != null && passwords.matches(input.password(), staffHash)) {
                return issue("staff", "STAFF", "Nhân viên");
            }
            throw invalid();
        }
        var customer = customers.findByEmailIgnoreCase(input.email()).orElse(null);
        if (!passwords.matches(input.password(), customer == null ? dummyHash : customer.getPasswordHash()) ||
            customer == null || customer.getStatus() != 1) {
            throw invalid();
        }
        return issue(customer.getId().toString(), "CUSTOMER", customer.getFullName());
    }

    private Session issue(String subject, String role, String name) {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder().issuer(SecurityConfig.ISSUER)
            .subject(subject).issuedAt(now).expiresAt(now.plusSeconds(1800)).claim("role", role).build();
        String token = tokens.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), claims))
            .getTokenValue();
        return new Session(token, role, name);
    }

    private ResponseStatusException invalid() {
        return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email hoặc mật khẩu không đúng");
    }
}
