// Author: Lam Thoai Thanh - CE190169
package fu.se.ass2;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.*;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.*;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class AssignmentApiTest {
  @Autowired MockMvc mvc;
  @Autowired ObjectMapper json;
  @Autowired JdbcTemplate jdbc;
  @Autowired PasswordEncoder encoder;

  @BeforeEach
  void seedAccounts() {
    String hash = encoder.encode("Demo123!");
    jdbc.update(
        "INSERT INTO dbo.SystemAccount(AccountID,AccountName,AccountEmail,AccountRole,AccountPassword) VALUES(1,'Staff One','staff1@test.local',2,?)",
        hash);
    jdbc.update(
        "INSERT INTO dbo.SystemAccount(AccountID,AccountName,AccountEmail,AccountRole,AccountPassword) VALUES(2,'Staff Two','staff2@test.local',2,?)",
        hash);
    jdbc.update(
        "INSERT INTO dbo.SystemAccount(AccountID,AccountName,AccountEmail,AccountRole,AccountPassword) VALUES(5,'Admin','admin@test.local',1,?)",
        hash);
  }

  String body(Object value) throws Exception {
    return json.writeValueAsString(value);
  }

  Map<String, Object> category(String name) {
    return new LinkedHashMap<>(
        Map.of("categoryName", name, "categoryDescription", "Mô tả tiếng Việt", "active", true));
  }

  short createCategory(String name) throws Exception {
    var r =
        mvc.perform(
                post("/api/categories")
                    .with(csrf())
                    .contentType("application/json")
                    .content(body(category(name))))
            .andExpect(status().isCreated())
            .andReturn();
    return (short) json.readTree(r.getResponse().getContentAsString()).get("categoryId").asInt();
  }

  Map<String, Object> article(short categoryId, boolean active) {
    return new LinkedHashMap<>(
        Map.of(
            "newsTitle",
            "Campus story",
            "headline",
            "Headline",
            "newsContent",
            "Nội dung",
            "categoryId",
            categoryId,
            "newsStatus",
            active,
            "tags",
            List.of(Map.of("tagName", "Campus", "note", "Note"))));
  }

  String createArticle(short categoryId, boolean active) throws Exception {
    var r =
        mvc.perform(
                post("/api/news")
                    .with(csrf())
                    .contentType("application/json")
                    .content(body(article(categoryId, active))))
            .andExpect(status().isCreated())
            .andReturn();
    return json.readTree(r.getResponse().getContentAsString()).get("newsArticleId").asText();
  }

  @Test
  void anonymousCanReadPublicButCannotReadPrivate() throws Exception {
    mvc.perform(get("/api/public/news"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content").isArray());
    mvc.perform(get("/api/accounts")).andExpect(status().isUnauthorized());
    mvc.perform(get("/api/news")).andExpect(status().isUnauthorized());
  }

  @Test
  void loginUsesEmailAndPasswordAndHidesHash() throws Exception {
    mvc.perform(
            post("/api/auth/login")
                .with(csrf())
                .contentType("application/json")
                .content(body(Map.of("email", "staff1@test.local", "password", "Demo123!"))))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.accountRole").value(2))
        .andExpect(jsonPath("$.accountPassword").doesNotExist())
        .andExpect(jsonPath("$.password").doesNotExist());
  }

  @Test
  void invalidLoginReturns401() throws Exception {
    mvc.perform(
            post("/api/auth/login")
                .with(csrf())
                .contentType("application/json")
                .content(body(Map.of("email", "staff1@test.local", "password", "wrong"))))
        .andExpect(status().isUnauthorized());
  }

  @Test
  @WithMockUser(username = "1", roles = "STAFF")
  void staffCannotManageAccounts() throws Exception {
    mvc.perform(get("/api/accounts")).andExpect(status().isForbidden());
    mvc.perform(post("/api/accounts").with(csrf()).contentType("application/json").content("{}"))
        .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(username = "5", roles = "ADMIN")
  void adminCannotManageStaffResources() throws Exception {
    mvc.perform(get("/api/categories")).andExpect(status().isForbidden());
    mvc.perform(get("/api/news/history")).andExpect(status().isForbidden());
    mvc.perform(get("/api/profile")).andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(username = "1", roles = "STAFF")
  void csrfIsRequiredForWrites() throws Exception {
    mvc.perform(
            post("/api/categories")
                .contentType("application/json")
                .content(body(category("Blocked"))))
        .andExpect(status().isForbidden());
    assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM dbo.Category", Integer.class)).isZero();
  }

  @Test
  @WithMockUser(username = "1", roles = "STAFF")
  void categoryCrudAndUnicode() throws Exception {
    short id = createCategory("Học tập");
    mvc.perform(get("/api/categories/" + id))
        .andExpect(jsonPath("$.categoryName").value("Học tập"));
    var r = category("Đã đổi");
    r.put("active", false);
    mvc.perform(
            put("/api/categories/" + id)
                .with(csrf())
                .contentType("application/json")
                .content(body(r)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.active").value(false));
    mvc.perform(delete("/api/categories/" + id).with(csrf())).andExpect(status().isNoContent());
    mvc.perform(get("/api/categories/" + id)).andExpect(status().isNotFound());
  }

  @Test
  @WithMockUser(username = "1", roles = "STAFF")
  void blankAndDuplicateCategoryRejected() throws Exception {
    mvc.perform(
            post("/api/categories")
                .with(csrf())
                .contentType("application/json")
                .content(body(category(" "))))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.fieldErrors.categoryName").exists());
    createCategory("Academic");
    mvc.perform(
            post("/api/categories")
                .with(csrf())
                .contentType("application/json")
                .content(body(category(" ACADEMIC "))))
        .andExpect(status().isConflict());
  }

  @Test
  @WithMockUser(username = "1", roles = "STAFF")
  void missingPutDoesNotCreate() throws Exception {
    mvc.perform(
            put("/api/categories/32767")
                .with(csrf())
                .contentType("application/json")
                .content(body(category("Missing"))))
        .andExpect(status().isNotFound());
    assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM dbo.Category", Integer.class)).isZero();
  }

  @Test
  @WithMockUser(username = "1", roles = "STAFF")
  void parentCycleAndReferencedDeleteRejected() throws Exception {
    short parent = createCategory("Parent");
    var child = category("Child");
    child.put("parentCategoryId", parent);
    var r =
        mvc.perform(
                post("/api/categories")
                    .with(csrf())
                    .contentType("application/json")
                    .content(body(child)))
            .andExpect(status().isCreated())
            .andReturn();
    short id =
        (short) json.readTree(r.getResponse().getContentAsString()).get("categoryId").asInt();
    var cycle = category("Parent");
    cycle.put("parentCategoryId", id);
    mvc.perform(
            put("/api/categories/" + parent)
                .with(csrf())
                .contentType("application/json")
                .content(body(cycle)))
        .andExpect(status().isConflict());
    mvc.perform(delete("/api/categories/" + parent).with(csrf())).andExpect(status().isConflict());
  }

  @Test
  @WithMockUser(username = "1", roles = "STAFF")
  void draftIsHiddenFromPublicAndActiveIsVisible() throws Exception {
    short cat = createCategory("News");
    String id = createArticle(cat, false);
    mvc.perform(get("/api/public/news/" + id)).andExpect(status().isNotFound());
    mvc.perform(get("/api/public/news")).andExpect(jsonPath("$.totalElements").value(0));
    mvc.perform(
            put("/api/news/" + id)
                .with(csrf())
                .contentType("application/json")
                .content(body(article(cat, true))))
        .andExpect(status().isOk());
    mvc.perform(get("/api/public/news/" + id)).andExpect(status().isOk());
  }

  @Test
  @WithMockUser(username = "1", roles = "STAFF")
  void newsTagsAndCreatorCannotBeSpoofed() throws Exception {
    short cat = createCategory("News");
    var input = article(cat, true);
    input.put("createdById", 2);
    input.put(
        "tags",
        List.of(
            Map.of("tagName", "Campus"),
            Map.of("tagName", "campus"),
            Map.of("tagName", "Research")));
    var r =
        mvc.perform(
                post("/api/news").with(csrf()).contentType("application/json").content(body(input)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.createdById").value(1))
            .andExpect(jsonPath("$.tags.length()").value(2))
            .andReturn();
    String id = json.readTree(r.getResponse().getContentAsString()).get("newsArticleId").asText();
    mvc.perform(delete("/api/categories/" + cat).with(csrf())).andExpect(status().isConflict());
    mvc.perform(delete("/api/news/" + id).with(csrf())).andExpect(status().isNoContent());
    assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM dbo.NewsTag", Integer.class)).isZero();
    assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM dbo.Tag", Integer.class)).isEqualTo(2);
  }

  @Test
  @WithMockUser(username = "1", roles = "STAFF")
  void historyIsOwnOnly() throws Exception {
    short cat = createCategory("History");
    createArticle(cat, true);
    jdbc.update(
        "INSERT INTO dbo.NewsArticle(NewsArticleID,Headline,NewsTitle,CreatedByID,CategoryID,NewsStatus) VALUES('other','Other','Other',2,?,1)",
        cat);
    mvc.perform(get("/api/news/history"))
        .andExpect(jsonPath("$.totalElements").value(1))
        .andExpect(jsonPath("$.content[0].createdById").value(1));
    mvc.perform(get("/api/news")).andExpect(jsonPath("$.totalElements").value(2));
  }

  @Test
  @WithMockUser(username = "1", roles = "STAFF")
  void editPreservesCreatorAndCreatedDate() throws Exception {
    short cat = createCategory("Timestamps");
    String id = createArticle(cat, false);
    var before =
        jdbc.queryForObject(
            "SELECT CreatedDate FROM dbo.NewsArticle WHERE NewsArticleID=?",
            java.sql.Timestamp.class,
            id);
    mvc.perform(
            put("/api/news/" + id)
                .with(csrf())
                .contentType("application/json")
                .content(body(article(cat, true))))
        .andExpect(jsonPath("$.createdById").value(1))
        .andExpect(jsonPath("$.updatedById").value(1));
    assertThat(
            jdbc.queryForObject(
                "SELECT CreatedDate FROM dbo.NewsArticle WHERE NewsArticleID=?",
                java.sql.Timestamp.class,
                id))
        .isEqualTo(before);
  }

  @Test
  @WithMockUser(username = "1", roles = "STAFF")
  void profileCannotChangeRoleOrAnotherAccount() throws Exception {
    mvc.perform(
            put("/api/profile")
                .with(csrf())
                .contentType("application/json")
                .content(
                    body(
                        Map.of(
                            "accountName",
                            "My new name",
                            "accountEmail",
                            "staff1@test.local",
                            "accountRole",
                            1,
                            "accountId",
                            2,
                            "password",
                            ""))))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.accountId").value(1))
        .andExpect(jsonPath("$.accountRole").value(2));
    assertThat(
            jdbc.queryForObject(
                "SELECT AccountName FROM dbo.SystemAccount WHERE AccountID=2", String.class))
        .isEqualTo("Staff Two");
  }

  @Test
  @WithMockUser(username = "5", roles = "ADMIN")
  void accountCrudHashesPasswordAndRejectsDuplicate() throws Exception {
    var input =
        new LinkedHashMap<String, Object>(
            Map.of(
                "accountName",
                "New Staff",
                "accountEmail",
                "new@test.local",
                "accountRole",
                2,
                "password",
                "Demo123!"));
    var r =
        mvc.perform(
                post("/api/accounts")
                    .with(csrf())
                    .contentType("application/json")
                    .content(body(input)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.password").doesNotExist())
            .andReturn();
    short id = (short) json.readTree(r.getResponse().getContentAsString()).get("accountId").asInt();
    String hash =
        jdbc.queryForObject(
            "SELECT AccountPassword FROM dbo.SystemAccount WHERE AccountID=?", String.class, id);
    assertThat(hash).isNotEqualTo("Demo123!");
    assertThat(encoder.matches("Demo123!", hash)).isTrue();
    mvc.perform(
            post("/api/accounts").with(csrf()).contentType("application/json").content(body(input)))
        .andExpect(status().isConflict());
    input.put("password", "");
    input.put("accountName", "Revised");
    mvc.perform(
            put("/api/accounts/" + id)
                .with(csrf())
                .contentType("application/json")
                .content(body(input)))
        .andExpect(status().isOk());
    mvc.perform(delete("/api/accounts/" + id).with(csrf())).andExpect(status().isNoContent());
    mvc.perform(delete("/api/accounts/5").with(csrf())).andExpect(status().isConflict());
  }

  @Test
  @WithMockUser(username = "5", roles = "ADMIN")
  void creatorAccountCannotBeDeleted() throws Exception {
    jdbc.update(
        "INSERT INTO dbo.NewsArticle(NewsArticleID,Headline,CreatedByID) VALUES('protected','Test',1)");
    mvc.perform(delete("/api/accounts/1").with(csrf())).andExpect(status().isConflict());
    assertThat(
            jdbc.queryForObject(
                "SELECT COUNT(*) FROM dbo.SystemAccount WHERE AccountID=1", Integer.class))
        .isEqualTo(1);
  }

  @Test
  @WithMockUser(username = "1", roles = "STAFF")
  void pagingSearchValidationAndCors() throws Exception {
    createCategory("Alpha");
    createCategory("Alpine");
    createCategory("Beta");
    mvc.perform(get("/api/categories").param("keyword", "Al").param("size", "1").param("page", "1"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.totalElements").value(2))
        .andExpect(jsonPath("$.content.length()").value(1));
    mvc.perform(get("/api/categories").param("sort", "password,asc"))
        .andExpect(status().isBadRequest());
    mvc.perform(
            options("/api/news")
                .header("Origin", "http://localhost:5174")
                .header("Access-Control-Request-Method", "POST"))
        .andExpect(status().isOk())
        .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5174"));
  }
}
