// Author: Lam Thoai Thanh - CE190169
package fu.se.ass3.repository;

import fu.se.ass3.entity.BookingReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface BookingReservationRepository extends JpaRepository<BookingReservation, Integer> {
    List<BookingReservation> findAllByOrderByIdDesc();
    List<BookingReservation> findByCustomerIdOrderByIdDesc(int customerId);
    boolean existsByCustomerId(int customerId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select b from BookingReservation b where b.id = :id")
    Optional<BookingReservation> lockById(@Param("id") int id);

}
