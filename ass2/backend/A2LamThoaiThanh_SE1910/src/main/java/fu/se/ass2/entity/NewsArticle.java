// Author: Lam Thoai Thanh - CE190169
package fu.se.ass2.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.Nationalized;

@Entity
@Table(name = "NewsArticle", schema = "dbo")
public class NewsArticle {
  @Id
  @Nationalized
  @Column(name = "NewsArticleID", length = 20)
  private String newsArticleId;

  @Nationalized
  @Column(name = "NewsTitle", length = 400)
  private String newsTitle;

  @Nationalized
  @Column(name = "Headline", length = 150, nullable = false)
  private String headline;

  @Column(name = "CreatedDate", columnDefinition = "datetime")
  private java.time.LocalDateTime createdDate;

  @Nationalized
  @Column(name = "NewsContent", length = 4000)
  private String newsContent;

  @Nationalized
  @Column(name = "NewsSource", length = 400)
  private String newsSource;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "CategoryID")
  private Category category;

  @Column(name = "NewsStatus")
  private Boolean newsStatus;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "CreatedByID")
  private SystemAccount createdBy;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "UpdatedByID")
  private SystemAccount updatedBy;

  @Column(name = "ModifiedDate", columnDefinition = "datetime")
  private java.time.LocalDateTime modifiedDate;

  @ManyToMany
  @JoinTable(
      name = "NewsTag",
      schema = "dbo",
      joinColumns = @JoinColumn(name = "NewsArticleID"),
      inverseJoinColumns = @JoinColumn(name = "TagID"))
  private java.util.Set<Tag> tags = new java.util.LinkedHashSet<>();

  public String getNewsArticleId() {
    return newsArticleId;
  }

  public void setNewsArticleId(String value) {
    newsArticleId = value;
  }

  public String getNewsTitle() {
    return newsTitle;
  }

  public void setNewsTitle(String value) {
    newsTitle = value;
  }

  public String getHeadline() {
    return headline;
  }

  public void setHeadline(String value) {
    headline = value;
  }

  public java.time.LocalDateTime getCreatedDate() {
    return createdDate;
  }

  public void setCreatedDate(java.time.LocalDateTime value) {
    createdDate = value;
  }

  public String getNewsContent() {
    return newsContent;
  }

  public void setNewsContent(String value) {
    newsContent = value;
  }

  public String getNewsSource() {
    return newsSource;
  }

  public void setNewsSource(String value) {
    newsSource = value;
  }

  public Category getCategory() {
    return category;
  }

  public void setCategory(Category value) {
    category = value;
  }

  public Boolean getNewsStatus() {
    return newsStatus;
  }

  public void setNewsStatus(Boolean value) {
    newsStatus = value;
  }

  public SystemAccount getCreatedBy() {
    return createdBy;
  }

  public void setCreatedBy(SystemAccount value) {
    createdBy = value;
  }

  public SystemAccount getUpdatedBy() {
    return updatedBy;
  }

  public void setUpdatedBy(SystemAccount value) {
    updatedBy = value;
  }

  public java.time.LocalDateTime getModifiedDate() {
    return modifiedDate;
  }

  public void setModifiedDate(java.time.LocalDateTime value) {
    modifiedDate = value;
  }

  public java.util.Set<Tag> getTags() {
    return tags;
  }

  public void setTags(java.util.Set<Tag> value) {
    tags = value;
  }
}
