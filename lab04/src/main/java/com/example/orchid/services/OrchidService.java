package com.example.orchid.services;

import com.example.orchid.exceptions.ResourceNotFoundException;
import com.example.orchid.pojos.*;
import com.example.orchid.repositories.*;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class OrchidService implements IOrchidService {
  private final IOrchidRepository orchids;
  private final IOrchidCategoryRepository categories;

  public OrchidService(IOrchidRepository orchids, IOrchidCategoryRepository categories) {
    this.orchids = orchids;
    this.categories = categories;
  }

  public List<Orchid> getAll() {
    return orchids.findAll();
  }

  public List<Orchid> searchByName(String name) {
    return orchids.findByOrchidNameContainingIgnoreCase(name.trim());
  }

  public Orchid getById(Long id) {
    return orchids
        .findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Orchid not found: " + id));
  }

  private OrchidCategory category(Orchid input) {
    if (input.getOrchidCategory() == null || input.getOrchidCategory().getCategoryId() == null)
      throw new IllegalArgumentException("categoryId is required");
    return categories
        .findById(input.getOrchidCategory().getCategoryId())
        .orElseThrow(
            () ->
                new IllegalArgumentException(
                    "Category not found: " + input.getOrchidCategory().getCategoryId()));
  }

  private void copy(Orchid target, Orchid input) {
    OrchidCategory managed = category(input);
    String name = input.getOrchidName();
    if (name == null
        || name.isBlank()
        || name.trim().length() > 150
        || input.getIsNatural() == null
        || input.getIsAttractive() == null
        || input.getOrchidURL() == null
        || input.getOrchidURL().isBlank())
      throw new IllegalArgumentException("Invalid orchid data");
    target.setOrchidName(name.trim());
    target.setIsNatural(input.getIsNatural());
    target.setOrchidDescription(
        input.getOrchidDescription() == null ? "" : input.getOrchidDescription().trim());
    target.setOrchidCategory(managed);
    target.setIsAttractive(input.getIsAttractive());
    target.setOrchidURL(input.getOrchidURL().trim());
  }

  @Transactional
  public Orchid create(Orchid input) {
    Orchid created = new Orchid();
    copy(created, input);
    return orchids.save(created);
  }

  @Transactional
  public Orchid update(Long id, Orchid input) {
    Orchid existing = getById(id);
    copy(existing, input);
    return orchids.save(existing);
  }

  @Transactional
  public void delete(Long id) {
    orchids.delete(getById(id));
  }
}
