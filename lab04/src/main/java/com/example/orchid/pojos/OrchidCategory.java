package com.example.orchid.pojos;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.util.*;

@Entity
@Table(name = "orchid_categories")
public class OrchidCategory {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long categoryId;

  @NotBlank
  @Size(max = 100)
  @Column(nullable = false, unique = true, length = 100)
  private String categoryName;

  @OneToMany(mappedBy = "orchidCategory")
  @JsonIgnore
  private List<Orchid> orchids = new ArrayList<>();

  public OrchidCategory() {}

  public OrchidCategory(String name) {
    this.categoryName = name;
  }

  public Long getCategoryId() {
    return categoryId;
  }

  public void setCategoryId(Long value) {
    this.categoryId = value;
  }

  public String getCategoryName() {
    return categoryName;
  }

  public void setCategoryName(String value) {
    this.categoryName = value;
  }

  @JsonIgnore
  public List<Orchid> getOrchids() {
    return orchids;
  }

  public void setOrchids(List<Orchid> value) {
    this.orchids = value;
  }
}
