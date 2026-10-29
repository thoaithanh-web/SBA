// Author: Lam Thoai Thanh - CE190169
package fu.se.ass2.service;
import java.util.*;
import fu.se.ass2.dto.*;
import fu.se.ass2.entity.Category;
import fu.se.ass2.exception.DomainException;
import fu.se.ass2.repository.*;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service @Transactional(readOnly=true)
public class CategoryService {
 private final CategoryRepository repository;private final NewsRepository news;
 public CategoryService(CategoryRepository repository,NewsRepository news){this.repository=repository;this.news=news;}
 public Page<CategoryResponse> list(String keyword,Pageable page){PagePolicy.check(page,"categoryId","categoryName","active");var q=keyword==null?"":keyword.trim();return repository.findByCategoryNameContainingIgnoreCase(q,page).map(this::response);}
 public CategoryResponse get(short id){return response(find(id));}
 @Transactional public CategoryResponse create(CategoryRequest r){var c=new Category();apply(c,r);return response(repository.saveAndFlush(c));}
 @Transactional public CategoryResponse update(short id,CategoryRequest r){var c=find(id);apply(c,r);return response(repository.saveAndFlush(c));}
 @Transactional public void delete(short id){var c=find(id);if(news.existsByCategory_CategoryId(id))throw DomainException.conflict("Cannot delete a category used by news articles");if(repository.existsByParentCategoryId(id))throw DomainException.conflict("Cannot delete a category with child categories");repository.delete(c);repository.flush();}
 private void apply(Category c,CategoryRequest r){boolean duplicate=c.getCategoryId()==null?repository.existsByCategoryNameIgnoreCase(r.categoryName().trim()):repository.existsByCategoryNameIgnoreCaseAndCategoryIdNot(r.categoryName().trim(),c.getCategoryId());if(duplicate)throw DomainException.conflict("Category name already exists");Short id=r.parentCategoryId();Set<Short> seen=new HashSet<>();while(id!=null){if(Objects.equals(id,c.getCategoryId())||!seen.add(id))throw DomainException.conflict("Parent category would create a cycle");id=find(id).getParentCategoryId();}c.setCategoryName(r.categoryName().trim());c.setCategoryDescription(r.categoryDescription().trim());c.setParentCategoryId(r.parentCategoryId());c.setActive(r.active()==null||r.active());}
 public Category find(short id){return repository.findById(id).orElseThrow(()->DomainException.missing("Category",id));}
 private CategoryResponse response(Category c){return new CategoryResponse(c.getCategoryId(),c.getCategoryName(),c.getCategoryDescription(),c.getParentCategoryId(),c.getActive());}
}
