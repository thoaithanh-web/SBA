// Author: Lam Thoai Thanh - CE190169
package fu.se.ass2.repository;

import fu.se.ass2.entity.NewsArticle;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface NewsRepository extends JpaRepository<NewsArticle, String> {
  @Modifying
  @Query("update NewsArticle n set n.updatedBy=null where n.updatedBy.accountId=:id")
  void clearUpdater(@Param("id") Short id);

  boolean existsByCategory_CategoryId(Short id);

  boolean existsByCreatedBy_AccountId(Short id);

  @Query(
      "select n from NewsArticle n where (:keyword='' or lower(n.newsTitle) like lower(concat('%',:keyword,'%')) or lower(n.headline) like lower(concat('%',:keyword,'%'))) and (:activeOnly=false or n.newsStatus=true) and (:creator is null or n.createdBy.accountId=:creator)")
  Page<NewsArticle> search(
      @Param("keyword") String keyword,
      @Param("activeOnly") boolean activeOnly,
      @Param("creator") Short creator,
      Pageable page);
}
