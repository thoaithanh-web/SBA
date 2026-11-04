// Author: Lam Thoai Thanh - CE190169
package fu.se.ass3.repository;

import fu.se.ass3.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    Optional<Customer> findByEmailIgnoreCase(String email);
    List<Customer> findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrderByFullName(String name, String email);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select c from Customer c where c.id = :id")
    Optional<Customer> lockById(@Param("id") int id);

}
