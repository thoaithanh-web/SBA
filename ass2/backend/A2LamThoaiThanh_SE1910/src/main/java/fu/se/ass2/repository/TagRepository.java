// Author: Lam Thoai Thanh - CE190169
package fu.se.ass2.repository;

import java.util.Optional;
import fu.se.ass2.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
public interface TagRepository extends JpaRepository<Tag,Integer> {
 Optional<Tag> findFirstByTagNameIgnoreCase(String name);
}
