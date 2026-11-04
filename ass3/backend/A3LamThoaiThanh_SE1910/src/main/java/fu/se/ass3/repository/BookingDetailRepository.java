// Author: Lam Thoai Thanh - CE190169
package fu.se.ass3.repository;

import fu.se.ass3.entity.BookingDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import fu.se.ass3.entity.BookingDetailKey;
import java.time.LocalDate;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookingDetailRepository extends JpaRepository<BookingDetail, BookingDetailKey> {
    boolean existsByRoomId(int roomId);

    @Query("""
        select count(d) from BookingDetail d
        where d.room.id = :roomId and d.booking.status = 1
          and d.booking.id <> :excluded
          and d.startDate < :endDate and d.endDate > :startDate
        """)
    long countOverlaps(@Param("roomId") int roomId, @Param("excluded") int excluded,
                       @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

}
