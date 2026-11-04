// Author: Lam Thoai Thanh - CE190169
package fu.se.ass3.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import org.hibernate.annotations.Nationalized;

@Entity
@Table(name = "Customer")
@Getter
@Setter
public class Customer {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CustomerID")
    private Integer id;
    @Nationalized @Column(name = "CustomerFullName", length = 50, nullable = false)
    private String fullName;
    @Nationalized @Column(name = "Telephone", length = 12)
    private String telephone;
    @Nationalized @Column(name = "EmailAddress", length = 50, unique = true, nullable = false)
    private String email;
    @Column(name = "CustomerBirthday")
    private LocalDate birthday;
    @Column(name = "CustomerStatus", columnDefinition = "tinyint", nullable = false)
    private byte status = 1;
    @Nationalized @Column(name = "Password", length = 100, nullable = false)
    private String passwordHash;
}
