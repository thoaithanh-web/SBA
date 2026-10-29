// Author: Lam Thoai Thanh - CE190169
package fu.se.ass2.repository;

import java.util.Optional;
import fu.se.ass2.entity.SystemAccount;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
public interface AccountRepository extends JpaRepository<SystemAccount,Short> {
 Optional<SystemAccount> findByAccountEmailIgnoreCase(String email);
 boolean existsByAccountEmailIgnoreCaseAndAccountIdNot(String email,Short id);
 Page<SystemAccount> findByAccountNameContainingIgnoreCaseOrAccountEmailContainingIgnoreCase(String name,String email,Pageable page);
 long countByAccountRole(Integer role);
}
