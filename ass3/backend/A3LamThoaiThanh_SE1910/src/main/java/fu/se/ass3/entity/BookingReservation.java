// Author: Lam Thoai Thanh - CE190169
package fu.se.ass3.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "BookingReservation")
@Getter
@Setter
public class BookingReservation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BookingReservationID")
    private Integer id;
    @Column(name = "BookingDate", nullable = false)
    private LocalDate bookingDate;
    @Column(name = "TotalPrice", precision = 19, scale = 4, nullable = false)
    private BigDecimal totalPrice;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "CustomerID")
    private Customer customer;
    @Column(name = "BookingStatus", nullable = false)
    private byte status = 1;
    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookingDetail> details = new ArrayList<>();
}
