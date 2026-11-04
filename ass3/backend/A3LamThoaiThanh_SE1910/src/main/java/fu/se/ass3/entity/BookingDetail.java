// Author: Lam Thoai Thanh - CE190169
package fu.se.ass3.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.math.BigDecimal;

@Entity
@Table(name = "BookingDetail")
@Getter
@Setter
@IdClass(BookingDetailKey.class)
public class BookingDetail {
    @Id @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "BookingReservationID")
    private BookingReservation booking;
    @Id @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "RoomID")
    private RoomInformation room;
    @Column(name = "StartDate", nullable = false)
    private LocalDate startDate;
    @Column(name = "EndDate", nullable = false)
    private LocalDate endDate;
    @Column(name = "ActualPrice", columnDefinition = "money", nullable = false)
    private BigDecimal actualPrice;
}
