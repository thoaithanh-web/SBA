// Author: Lam Thoai Thanh - CE190169
package fu.se.ass2.repository;

import fu.se.ass2.entity.Category;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Short> {
  boolean existsByCategoryNameIgnoreCaseAndCategoryIdNot(String name, Short id);

  boolean existsByCategoryNameIgnoreCase(String name);

  boolean existsByParentCategoryId(Short id);

  Page<Category> findByCategoryNameContainingIgnoreCase(String keyword, Pageable page);
}
