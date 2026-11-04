// Author: Lam Thoai Thanh - CE190169

package fu.se.ass3.controller;

import fu.se.ass3.dto.HotelDtos.*;
import fu.se.ass3.service.*;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
public class StaffController {
    private final CustomerService customers;
    private final RoomService rooms;
    private final BookingService bookings;

    @GetMapping("/customers")
    public List<CustomerView> customers(@RequestParam(defaultValue = "") String q) {
        return customers.list(q);
    }

    @GetMapping("/customers/{id}")
    public CustomerView customer(@PathVariable int id) {
        return customers.get(id);
    }

    @PostMapping("/customers")
    @ResponseStatus(HttpStatus.CREATED)
    public CustomerView createCustomer(@Valid @RequestBody CustomerInput input) {
        return customers.save(null, input, true);
    }

    @PutMapping("/customers/{id}")
    public CustomerView updateCustomer(@PathVariable int id, @Valid @RequestBody CustomerInput input) {
        return customers.save(id, input, true);
    }

    @DeleteMapping("/customers/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCustomer(@PathVariable int id) {
        customers.delete(id);
    }

    @GetMapping("/rooms")
    public List<RoomView> rooms(@RequestParam(defaultValue = "") String q) {
        return rooms.list(q, true, null, null);
    }

    @GetMapping("/rooms/{id}")
    public RoomView room(@PathVariable int id) {
        return rooms.get(id, true);
    }

    @PostMapping("/rooms")
    @ResponseStatus(HttpStatus.CREATED)
    public RoomView createRoom(@Valid @RequestBody RoomInput input) {
        return rooms.save(null, input);
    }

    @PutMapping("/rooms/{id}")
    public RoomView updateRoom(@PathVariable int id, @Valid @RequestBody RoomInput input) {
        return rooms.save(id, input);
    }

    @DeleteMapping("/rooms/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRoom(@PathVariable int id) {
        rooms.delete(id);
    }

    @GetMapping("/bookings")
    public List<BookingView> bookings(@RequestParam(defaultValue = "") String q) {
        return bookings.list(null, q);
    }

    @GetMapping("/bookings/{id}")
    public BookingView booking(@PathVariable int id) {
        return bookings.get(id, null);
    }

    @PostMapping("/bookings")
    @ResponseStatus(HttpStatus.CREATED)
    public BookingView createBooking(@Valid @RequestBody BookingInput input) {
        return bookings.save(null, input, null);
    }

    @PutMapping("/bookings/{id}")
    public BookingView updateBooking(@PathVariable int id, @Valid @RequestBody BookingInput input) {
        return bookings.save(id, input, null);
    }

    @PutMapping("/bookings/{id}/status")
    public BookingView status(@PathVariable int id, @Valid @RequestBody BookingStatus input) {
        return bookings.status(id, input.status());
    }

    @DeleteMapping("/bookings/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancelBooking(@PathVariable int id) {
        bookings.status(id, 0);
    }
}
