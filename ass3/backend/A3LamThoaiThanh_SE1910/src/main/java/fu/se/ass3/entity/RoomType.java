// Author: Lam Thoai Thanh - CE190169
package fu.se.ass3.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

@Entity
@Table(name = "RoomType")
@Getter
@Setter
public class RoomType {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RoomTypeID")
    private Integer id;
    @Nationalized @Column(name = "RoomTypeName", length = 50, nullable = false)
    private String name;
    @Nationalized @Column(name = "TypeDescription", length = 250)
    private String description;
    @Nationalized @Column(name = "TypeNote", length = 250)
    private String note;
}
