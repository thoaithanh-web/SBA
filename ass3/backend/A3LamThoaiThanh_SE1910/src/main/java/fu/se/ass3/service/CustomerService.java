// Author: Lam Thoai Thanh - CE190169

package fu.se.ass3.service;

import fu.se.ass3.dto.HotelDtos.*;
import fu.se.ass3.entity.Customer;
import fu.se.ass3.repository.BookingReservationRepository;
import fu.se.ass3.repository.CustomerRepository;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CustomerService {
    private final CustomerRepository customers;
    private final BookingReservationRepository bookings;
    private final PasswordEncoder encoder;
    @Value("${app.staff.email}")
    private String staffEmail;

    public List<CustomerView> list(String query) {
        return customers.findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrderByFullName(query, query)
            .stream().map(CustomerService::view).toList();
    }

    public CustomerView get(int id) {
        return view(customers.findById(id).orElseThrow(CustomerService::missing));
    }

    @Transactional
    public CustomerView save(Integer id, CustomerInput input, boolean staff) {
        Customer customer = id == null ? new Customer() : customers.lockById(id).orElseThrow(CustomerService::missing);
        String email = input.email().trim().toLowerCase(Locale.ROOT);
        if (staffEmail.equalsIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email đã được sử dụng");
        }
        if (customers.findByEmailIgnoreCase(email).filter(other -> !other.getId().equals(id)).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email đã được sử dụng");
        }
        if (id == null || (input.password() != null && !input.password().isEmpty())) {
            String password = input.password();
            if (password == null || password.isBlank() || password.length() < 8 ||
                password.getBytes(StandardCharsets.UTF_8).length > 72) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu cần ít nhất 8 ký tự và tối đa 72 byte");
            }
            customer.setPasswordHash(encoder.encode(password));
        }
        customer.setFullName(input.fullName().strip());
        customer.setEmail(email);
        customer.setTelephone(input.telephone());
        customer.setBirthday(input.birthday());
        if (staff && input.active() != null) {
            customer.setStatus((byte) (input.active() ? 1 : 0));
        }
        return view(customers.saveAndFlush(customer));
    }

    @Transactional
    public void delete(int id) {
        Customer customer = customers.lockById(id).orElseThrow(CustomerService::missing);
        if (bookings.existsByCustomerId(id)) {
            customer.setStatus((byte) 0);
        } else {
            customers.delete(customer);
        }
    }

    private static CustomerView view(Customer c) {
        return new CustomerView(c.getId(), c.getFullName(), c.getTelephone(), c.getEmail(), c.getBirthday(), c.getStatus() == 1);
    }

    private static ResponseStatusException missing() {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy khách hàng");
    }
}
