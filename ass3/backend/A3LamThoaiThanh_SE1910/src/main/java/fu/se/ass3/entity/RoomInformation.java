// Author: Lam Thoai Thanh - CE190169
package fu.se.ass3.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import org.hibernate.annotations.Nationalized;

@Entity
@Table(name = "RoomInformation")
@Getter
@Setter
public class RoomInformation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RoomID")
    private Integer id;
    @Nationalized @Column(name = "RoomNumber", length = 50, unique = true, nullable = false)
    private String number;
    @Nationalized @Column(name = "RoomDetailDescription", length = 220)
    private String description;
    @Column(name = "RoomMaxCapacity", nullable = false)
    private int capacity;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "RoomTypeID")
    private RoomType type;
    @Column(name = "RoomStatus", nullable = false)
    private byte status = 1;
    @Column(name = "RoomPricePerDay", precision = 19, scale = 4, nullable = false)
    private BigDecimal pricePerDay;
}
