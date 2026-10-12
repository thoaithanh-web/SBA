package com.example.orchid.services;

import com.example.orchid.exceptions.*;
import com.example.orchid.pojos.OrchidCategory;
import com.example.orchid.repositories.*;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class CategoryService {
  private final IOrchidCategoryRepository categories;
  private final IOrchidRepository orchids;

  public CategoryService(IOrchidCategoryRepository categories, IOrchidRepository orchids) {
    this.categories = categories;
    this.orchids = orchids;
  }

  public List<OrchidCategory> getAll() {
    return categories.findAll();
  }

  @Transactional
  public OrchidCategory create(OrchidCategory input) {
    String name = input.getCategoryName().trim();
    if (name.isEmpty()) throw new IllegalArgumentException("Category name is required");
    if (categories.existsByCategoryNameIgnoreCase(name))
      throw new ConflictException("Category name already exists");
    return categories.save(new OrchidCategory(name));
  }

  @Transactional
  public void delete(Long id) {
    OrchidCategory category =
        categories
            .findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));
    if (orchids.existsByOrchidCategoryCategoryId(id))
      throw new ConflictException("Category still contains orchids");
    categories.delete(category);
  }
}
