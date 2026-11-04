// Author: Lam Thoai Thanh - CE190169
package fu.se.ass3.repository;

import fu.se.ass3.entity.RoomInformation;
import org.springframework.data.jpa.repository.JpaRepository;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface RoomInformationRepository extends JpaRepository<RoomInformation, Integer> {
    List<RoomInformation> findByNumberContainingIgnoreCaseOrderByNumber(String number);
    boolean existsByNumberIgnoreCaseAndIdNot(String number, int id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select r from RoomInformation r where r.id = :id")
    Optional<RoomInformation> lockById(@Param("id") int id);

}
