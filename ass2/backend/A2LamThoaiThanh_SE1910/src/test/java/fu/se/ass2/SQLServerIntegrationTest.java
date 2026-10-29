// Author: Lam Thoai Thanh - CE190169
package fu.se.ass2;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@EnabledIfEnvironmentVariable(named = "SQLSERVER_TESTS", matches = "true")
class SQLServerIntegrationTest {
  @Autowired MockMvc mvc;
  @Autowired JdbcTemplate jdbc;
  @Autowired ObjectMapper json;

  @Test
  @WithMockUser(username = "1", roles = "STAFF")
  void realSqlServerPersistsUnicodeAndProtectsForeignKeys() throws Exception {
    assertThat(jdbc.queryForObject("SELECT DB_NAME()", String.class))
        .isEqualTo("A2LamThoaiThanh_SE1910");
    assertThat(jdbc.queryForObject("SELECT @@VERSION", String.class))
        .contains("Microsoft SQL Server");
    String name = "SQL-" + System.nanoTime();
    var result =
        mvc.perform(
                post("/api/categories")
                    .with(csrf())
                    .contentType("application/json")
                    .content(
                        json.writeValueAsString(
                            Map.of(
                                "categoryName",
                                name,
                                "categoryDescription",
                                "Tiếng Việt: học tập, nghiên cứu",
                                "active",
                                true))))
            .andExpect(status().isCreated())
            .andReturn();
    int category =
        json.readTree(result.getResponse().getContentAsString()).get("categoryId").asInt();
    assertThat(
            jdbc.queryForObject(
                "SELECT CategoryDesciption FROM dbo.Category WHERE CategoryID=?",
                String.class,
                category))
        .isEqualTo("Tiếng Việt: học tập, nghiên cứu");
    var payload =
        Map.of(
            "newsTitle",
            "SQL persistence",
            "headline",
            "SQL test",
            "newsContent",
            "Nội dung được lưu thật",
            "categoryId",
            category,
            "newsStatus",
            false,
            "tags",
            java.util.List.of(Map.of("tagName", name)));
    var news =
        mvc.perform(
                post("/api/news")
                    .with(csrf())
                    .contentType("application/json")
                    .content(json.writeValueAsString(payload)))
            .andExpect(status().isCreated())
            .andReturn();
    String id =
        json.readTree(news.getResponse().getContentAsString()).get("newsArticleId").asText();
    assertThat(
            jdbc.queryForObject(
                "SELECT NewsContent FROM dbo.NewsArticle WHERE NewsArticleID=?", String.class, id))
        .isEqualTo("Nội dung được lưu thật");
    assertThat(
            jdbc.queryForObject(
                "SELECT COUNT(*) FROM dbo.NewsTag WHERE NewsArticleID=?", Integer.class, id))
        .isEqualTo(1);
    mvc.perform(get("/api/public/news/" + id)).andExpect(status().isNotFound());
    mvc.perform(delete("/api/categories/" + category).with(csrf()))
        .andExpect(status().isConflict());
    mvc.perform(delete("/api/news/" + id).with(csrf())).andExpect(status().isNoContent());
    assertThat(
            jdbc.queryForObject(
                "SELECT COUNT(*) FROM dbo.NewsTag WHERE NewsArticleID=?", Integer.class, id))
        .isZero();
    mvc.perform(delete("/api/categories/" + category).with(csrf()))
        .andExpect(status().isNoContent());
  }
}
