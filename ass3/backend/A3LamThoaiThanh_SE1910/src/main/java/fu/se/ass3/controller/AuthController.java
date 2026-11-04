// Author: Lam Thoai Thanh - CE190169

package fu.se.ass3.controller;

import fu.se.ass3.dto.HotelDtos.*;
import fu.se.ass3.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService auth;
    private final CustomerService customers;

    @PostMapping("/login")
    public Session login(@Valid @RequestBody Login input) {
        return auth.login(input);
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public CustomerView register(@Valid @RequestBody CustomerInput input) {
        return customers.save(null, input, false);
    }
}
