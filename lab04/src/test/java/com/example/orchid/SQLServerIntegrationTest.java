package com.example.orchid;

import static org.assertj.core.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.orchid.pojos.*;
import com.example.orchid.repositories.*;
import com.example.orchid.services.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@EnabledIfEnvironmentVariable(named = "SQLSERVER_TESTS", matches = "true")
class SQLServerIntegrationTest {
  @Autowired MockMvc mvc;
  @Autowired ObjectMapper json;
  @Autowired IOrchidCategoryRepository categories;
  @Autowired IOrchidRepository orchids;
  @Autowired IOrchidService service;
  @Autowired JdbcTemplate jdbc;

  Orchid input(Long categoryId) {
    var o = new Orchid();
    o.setOrchidName("Integration Cattleya");
    o.setIsNatural(true);
    o.setIsAttractive(true);
    o.setOrchidDescription("SQL Server test");
    o.setOrchidURL("/images/orchid.svg");
    var c = new OrchidCategory();
    c.setCategoryId(categoryId);
    o.setOrchidCategory(c);
    return o;
  }

  Long category() {
    return categories
        .saveAndFlush(new OrchidCategory("Test " + java.util.UUID.randomUUID()))
        .getCategoryId();
  }

  @Test
  void engineReallyIsSQLServer() {
    assertThat(
            jdbc.queryForObject(
                "SELECT CAST(SERVERPROPERTY('ProductVersion') AS varchar(30))", String.class))
        .startsWith("16.");
  }

  @Test
  void repositoryPersistsAndQueriesRelationship() {
    Long categoryId = category();
    var saved = service.create(input(categoryId));
    orchids.flush();
    assertThat(
            jdbc.queryForObject(
                "SELECT category_id FROM orchids WHERE orchid_id=?",
                Long.class,
                saved.getOrchidID()))
        .isEqualTo(categoryId);
    assertThat(service.searchByName("CATTLEYA"))
        .extracting(Orchid::getOrchidID)
        .contains(saved.getOrchidID());
  }

  @Test
  void schemaHasForeignKey() {
    Integer count =
        jdbc.queryForObject(
            "SELECT COUNT(*) FROM sys.foreign_keys WHERE parent_object_id=OBJECT_ID('orchids') AND"
                + " referenced_object_id=OBJECT_ID('orchid_categories')",
            Integer.class);
    assertThat(count).isGreaterThan(0);
  }

  @Test
  void httpCrudRoundTripAndNoRecursion() throws Exception {
    Long cat = category();
    String created =
        mvc.perform(
                post("/api/orchids")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json.writeValueAsString(input(cat))))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.orchidCategory.orchids").doesNotExist())
            .andReturn()
            .getResponse()
            .getContentAsString();
    Long id = json.readTree(created).get("orchidID").asLong();
    mvc.perform(get("/api/orchids/" + id))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.isNatural").value(true));
    var changed = input(cat);
    changed.setOrchidName("Updated Bloom");
    mvc.perform(
            put("/api/orchids/" + id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(changed)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.orchidName").value("Updated Bloom"));
    orchids.flush();
    assertThat(
            jdbc.queryForObject(
                "SELECT orchid_name FROM orchids WHERE orchid_id=?", String.class, id))
        .isEqualTo("Updated Bloom");
    mvc.perform(delete("/api/orchids/" + id)).andExpect(status().isNoContent());
    mvc.perform(get("/api/orchids/" + id)).andExpect(status().isNotFound());
  }

  @Test
  void nonexistentCategoryRejectedWithoutInsert() throws Exception {
    long before = orchids.count();
    mvc.perform(
            post("/api/orchids")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(input(Long.MAX_VALUE))))
        .andExpect(status().isBadRequest());
    assertThat(orchids.count()).isEqualTo(before);
  }

  @Test
  void changingCategoryUpdatesForeignKey() {
    Long a = category(), b = category();
    var saved = service.create(input(a));
    service.update(saved.getOrchidID(), input(b));
    orchids.flush();
    assertThat(
            jdbc.queryForObject(
                "SELECT category_id FROM orchids WHERE orchid_id=?",
                Long.class,
                saved.getOrchidID()))
        .isEqualTo(b);
  }

  @Test
  void linkedCategoryCannotBeDeleted() throws Exception {
    Long cat = category();
    service.create(input(cat));
    mvc.perform(delete("/api/categories/" + cat)).andExpect(status().isConflict());
    assertThat(categories.existsById(cat)).isTrue();
  }

  @Test
  void duplicateCategoryAndEmptyNameRejected() throws Exception {
    var c = categories.findById(category()).orElseThrow();
    mvc.perform(
            post("/api/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(new OrchidCategory(c.getCategoryName()))))
        .andExpect(status().isConflict());
    mvc.perform(
            post("/api/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"categoryName\":\" \"}"))
        .andExpect(status().isBadRequest());
  }

  @Test
  void swaggerDescribesActualPaths() throws Exception {
    mvc.perform(get("/v3/api-docs"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.paths['/api/orchids']").exists())
        .andExpect(jsonPath("$.paths['/api/orchids'].post.responses['201']").exists());
    mvc.perform(get("/swagger-ui/index.html")).andExpect(status().isOk());
  }
}
