// Author: Lam Thoai Thanh - CE190169

package fu.se.ass3.controller;

import fu.se.ass3.dto.HotelDtos.*;
import fu.se.ass3.service.*;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class CustomerController {
    private final CustomerService customers;
    private final BookingService bookings;

    @GetMapping("/profile")
    public CustomerView profile(Principal user) {
        return customers.get(id(user));
    }

    @PutMapping("/profile")
    public CustomerView updateProfile(Principal user, @Valid @RequestBody CustomerInput input) {
        return customers.save(id(user), input, false);
    }

    @GetMapping("/bookings")
    public List<BookingView> history(Principal user, @RequestParam(defaultValue = "") String q) {
        return bookings.list(id(user), q);
    }

    @GetMapping("/bookings/{id}")
    public BookingView booking(Principal user, @PathVariable int id) {
        return bookings.get(id, id(user));
    }

    @PostMapping("/bookings")
    @ResponseStatus(HttpStatus.CREATED)
    public BookingView book(Principal user, @Valid @RequestBody BookingInput input) {
        return bookings.save(null, input, id(user));
    }

    private int id(Principal user) {
        return Integer.parseInt(user.getName());
    }
}
