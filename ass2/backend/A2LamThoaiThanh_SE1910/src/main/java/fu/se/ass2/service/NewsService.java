// Author: Lam Thoai Thanh - CE190169
package fu.se.ass2.service;

import fu.se.ass2.dto.*;
import fu.se.ass2.entity.*;
import fu.se.ass2.exception.DomainException;
import fu.se.ass2.repository.*;
import java.time.LocalDateTime;
import java.util.*;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class NewsService {
  private final NewsRepository repository;
  private final CategoryService categories;
  private final TagRepository tags;
  private final CurrentAccount current;

  public NewsService(
      NewsRepository repository,
      CategoryService categories,
      TagRepository tags,
      CurrentAccount current) {
    this.repository = repository;
    this.categories = categories;
    this.tags = tags;
    this.current = current;
  }

  public Page<NewsResponse> list(String keyword, boolean publicOnly, boolean mine, Pageable page) {
    PagePolicy.check(
        page, "newsArticleId", "newsTitle", "createdDate", "modifiedDate", "newsStatus");
    return repository
        .search(
            keyword == null ? "" : keyword.trim(),
            publicOnly,
            mine ? current.get().getAccountId() : null,
            page)
        .map(this::response);
  }

  public NewsResponse get(String id, boolean publicOnly) {
    var n = find(id);
    if (publicOnly && !Boolean.TRUE.equals(n.getNewsStatus()))
      throw DomainException.missing("News article", id);
    return response(n);
  }

  @Transactional
  public NewsResponse create(NewsRequest r) {
    var n = new NewsArticle();
    n.setNewsArticleId(UUID.randomUUID().toString().replace("-", "").substring(0, 20));
    n.setCreatedDate(LocalDateTime.now());
    n.setCreatedBy(current.get());
    apply(n, r);
    return response(repository.saveAndFlush(n));
  }

  @Transactional
  public NewsResponse update(String id, NewsRequest r) {
    var n = find(id);
    apply(n, r);
    n.setUpdatedBy(current.get());
    n.setModifiedDate(LocalDateTime.now());
    return response(repository.saveAndFlush(n));
  }

  @Transactional
  public void delete(String id) {
    var n = find(id);
    n.getTags().clear();
    repository.flush();
    repository.delete(n);
    repository.flush();
  }

  public java.util.List<TagResponse> tags() {
    return tags.findAll(org.springframework.data.domain.Sort.by("tagName")).stream()
        .map(t -> new TagResponse(t.getTagId(), t.getTagName(), t.getNote()))
        .toList();
  }

  private void apply(NewsArticle n, NewsRequest r) {
    n.setCategory(categories.find(r.categoryId()));
    n.setNewsTitle(r.newsTitle().trim());
    n.setHeadline(r.headline().trim());
    n.setNewsContent(r.newsContent().trim());
    n.setNewsSource(r.newsSource() == null ? "" : r.newsSource().trim());
    n.setNewsStatus(r.newsStatus() != null && r.newsStatus());
    Set<Tag> selected = new LinkedHashSet<>();
    Set<String> names = new HashSet<>();
    if (r.tags() != null)
      for (var input : r.tags()) {
        String name = input.tagName().trim();
        if (!names.add(name.toLowerCase(Locale.ROOT))) continue;
        Tag tag;
        if (input.tagId() != null) {
          tag =
              tags.findById(input.tagId())
                  .orElseThrow(() -> DomainException.missing("Tag", input.tagId()));
          if (!tag.getTagName().trim().equalsIgnoreCase(name))
            throw DomainException.invalid("Tag ID and name do not match");
        } else {
          tag =
              tags.findFirstByTagNameIgnoreCase(name)
                  .orElseGet(
                      () -> {
                        var t = new Tag();
                        t.setTagName(name);
                        t.setNote(input.note() == null ? "" : input.note().trim());
                        return tags.save(t);
                      });
        }
        selected.add(tag);
      }
    n.setTags(selected);
  }

  private NewsArticle find(String id) {
    return repository.findById(id).orElseThrow(() -> DomainException.missing("News article", id));
  }

  private NewsResponse response(NewsArticle n) {
    return new NewsResponse(
        n.getNewsArticleId(),
        n.getNewsTitle(),
        n.getHeadline(),
        n.getNewsContent(),
        n.getNewsSource(),
        n.getCategory() == null ? null : n.getCategory().getCategoryId(),
        n.getCategory() == null ? null : n.getCategory().getCategoryName(),
        n.getNewsStatus(),
        n.getCreatedBy() == null ? null : n.getCreatedBy().getAccountId(),
        n.getCreatedBy() == null ? null : n.getCreatedBy().getAccountName(),
        n.getUpdatedBy() == null ? null : n.getUpdatedBy().getAccountId(),
        n.getCreatedDate(),
        n.getModifiedDate(),
        n.getTags().stream()
            .sorted(Comparator.comparing(Tag::getTagId))
            .map(t -> new TagResponse(t.getTagId(), t.getTagName(), t.getNote()))
            .toList());
  }
}
