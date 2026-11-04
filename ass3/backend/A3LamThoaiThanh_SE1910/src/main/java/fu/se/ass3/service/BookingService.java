// Author: Lam Thoai Thanh - CE190169

package fu.se.ass3.service;

import fu.se.ass3.dto.HotelDtos.*;
import fu.se.ass3.entity.*;
import fu.se.ass3.repository.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookingService {
    private final BookingReservationRepository bookings;
    private final BookingDetailRepository details;
    private final RoomInformationRepository rooms;
    private final CustomerRepository customers;

    public List<BookingView> list(Integer owner, String query) {
        var records = owner == null ? bookings.findAllByOrderByIdDesc() : bookings.findByCustomerIdOrderByIdDesc(owner);
        String keyword = query.strip().toLowerCase(Locale.ROOT);
        return records.stream().filter(b -> keyword.isEmpty() || b.getId().toString().contains(keyword) ||
            b.getCustomer().getFullName().toLowerCase(Locale.ROOT).contains(keyword)).map(BookingService::view).toList();
    }

    public BookingView get(int id, Integer owner) {
        return bookings.findById(id).filter(b -> owner == null || b.getCustomer().getId().equals(owner))
            .map(BookingService::view).orElseThrow(BookingService::missing);
    }

    @Transactional
    public BookingView save(Integer id, BookingInput input, Integer owner) {
        BookingReservation booking = id == null ? new BookingReservation() : bookings.lockById(id).orElseThrow(BookingService::missing);
        if (booking.getStatus() != 1) {
            throw conflict("Chỉ sửa được đơn đang xác nhận");
        }
        Integer customerId = owner != null ? owner : input.customerId();
        if (customerId == null) {
            throw invalid("Chọn khách hàng");
        }
        Customer customer = customers.lockById(customerId).filter(c -> c.getStatus() == 1)
            .orElseThrow(() -> invalid("Khách hàng không hoạt động hoặc không tồn tại"));
        LocalDate today = LocalDate.now(ZoneId.of("Asia/Ho_Chi_Minh"));
        Map<Integer, StayInput> requested = new TreeMap<>();
        for (StayInput stay : input.details()) {
            long days = ChronoUnit.DAYS.between(stay.startDate(), stay.endDate());
            if (days < 1 || days > 365 || (owner != null && stay.startDate().isBefore(today))) {
                throw invalid("Ngày trả phải sau ngày nhận, tối đa 365 đêm và khách chỉ đặt từ hôm nay");
            }
            if (requested.putIfAbsent(stay.roomId(), stay) != null) {
                throw invalid("Mỗi phòng chỉ được chọn một lần trong đơn");
            }
        }
        Map<Integer, BookingDetail> current = new HashMap<>();
        booking.getDetails().forEach(detail -> current.put(detail.getRoom().getId(), detail));
        Set<Integer> affected = new TreeSet<>(current.keySet());
        affected.addAll(requested.keySet());
        Map<Integer, RoomInformation> locked = new HashMap<>();
        for (int roomId : affected) {
            locked.put(roomId, rooms.lockById(roomId).orElseThrow(() -> invalid("Phòng không tồn tại")));
        }
        for (StayInput stay : requested.values()) {
            RoomInformation room = locked.get(stay.roomId());
            if (room.getStatus() != 1 && !current.containsKey(room.getId())) {
                throw conflict("Phòng " + room.getNumber() + " đã ngừng hoạt động");
            }
            if (details.countOverlaps(room.getId(), id == null ? 0 : id, stay.startDate(), stay.endDate()) > 0) {
                throw conflict("Phòng " + room.getNumber() + " đã có người đặt trong khoảng ngày này");
            }
        }
        booking.setCustomer(customer);
        if (id == null) {
            booking.setBookingDate(today);
        }
        booking.getDetails().removeIf(detail -> !requested.containsKey(detail.getRoom().getId()));
        BigDecimal total = BigDecimal.ZERO;
        for (StayInput stay : requested.values()) {
            BookingDetail detail = current.get(stay.roomId());
            if (detail == null) {
                RoomInformation room = locked.get(stay.roomId());
                detail = new BookingDetail();
                detail.setBooking(booking);
                detail.setRoom(room);
                detail.setActualPrice(room.getPricePerDay());
                booking.getDetails().add(detail);
            }
            detail.setStartDate(stay.startDate());
            detail.setEndDate(stay.endDate());
            total = total.add(detail.getActualPrice().multiply(BigDecimal.valueOf(
                ChronoUnit.DAYS.between(stay.startDate(), stay.endDate()))));
        }
        booking.setTotalPrice(total);
        return view(bookings.saveAndFlush(booking));
    }

    @Transactional
    public BookingView status(int id, int status) {
        BookingReservation booking = bookings.lockById(id).orElseThrow(BookingService::missing);
        if (booking.getStatus() == status) {
            return view(booking);
        }
        if (booking.getStatus() != 1 || status == 1) {
            throw conflict("Không thể mở lại đơn đã hủy hoặc hoàn tất");
        }
        booking.getDetails().stream().map(d -> d.getRoom().getId()).sorted().forEach(rooms::lockById);
        if (status == 2 && booking.getDetails().stream().anyMatch(
            d -> d.getEndDate().isAfter(LocalDate.now(ZoneId.of("Asia/Ho_Chi_Minh"))))) {
            throw conflict("Chỉ hoàn tất đơn sau ngày trả phòng");
        }
        booking.setStatus((byte) status);
        return view(booking);
    }

    private static BookingView view(BookingReservation b) {
        var stays = b.getDetails().stream().sorted(Comparator.comparing(d -> d.getRoom().getId()))
            .map(d -> new StayView(d.getRoom().getId(), d.getRoom().getNumber(), d.getStartDate(),
                                  d.getEndDate(), d.getActualPrice())).toList();
        return new BookingView(b.getId(), b.getBookingDate(), b.getCustomer().getId(),
                               b.getCustomer().getFullName(), b.getStatus(), b.getTotalPrice(), stays);
    }

    private static ResponseStatusException invalid(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }

    private static ResponseStatusException conflict(String message) {
        return new ResponseStatusException(HttpStatus.CONFLICT, message);
    }

    private static ResponseStatusException missing() {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn đặt phòng");
    }
}
