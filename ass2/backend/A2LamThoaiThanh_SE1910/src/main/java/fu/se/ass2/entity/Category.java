// Author: Lam Thoai Thanh - CE190169
package fu.se.ass2.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.Nationalized;

@Entity
@Table(name = "Category", schema = "dbo")
public class Category {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "CategoryID")
  private Short categoryId;

  @Nationalized
  @Column(name = "CategoryName", length = 100, nullable = false)
  private String categoryName;

  @Nationalized
  @Column(name = "CategoryDesciption", length = 250, nullable = false)
  private String categoryDescription;

  @Column(name = "ParentCategoryID")
  private Short parentCategoryId;

  @Column(name = "IsActive")
  private Boolean active;

  public Short getCategoryId() {
    return categoryId;
  }

  public void setCategoryId(Short value) {
    categoryId = value;
  }

  public String getCategoryName() {
    return categoryName;
  }

  public void setCategoryName(String value) {
    categoryName = value;
  }

  public String getCategoryDescription() {
    return categoryDescription;
  }

  public void setCategoryDescription(String value) {
    categoryDescription = value;
  }

  public Short getParentCategoryId() {
    return parentCategoryId;
  }

  public void setParentCategoryId(Short value) {
    parentCategoryId = value;
  }

  public Boolean getActive() {
    return active;
  }

  public void setActive(Boolean value) {
    active = value;
  }
}
