package fu.se.backend.orchids;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class OrchidApiTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper mapper;
    @Autowired OrchidRepository repository;

    @BeforeEach
    void clear() {
        repository.deleteAll();
    }

    private String payload(String name, boolean natural, boolean attractive) throws Exception {
        return mapper.writeValueAsString(Map.of("orchidName", name, "natural", natural,
                "attractive", attractive, "orchidDescription", "Mô tả hoa lan tiếng Việt",
                "orchidCategory", "Cattleya", "orchidURL", "https://example.com/orchid.jpg"));
    }

    @Test
    void listStartsEmpty() throws Exception {
        mvc.perform(get("/orchids")).andExpect(status().isOk()).andExpect(content().json("[]"));
    }

    @Test
    void completeCrudPreservesIdentityAndAllFields() throws Exception {
        String body = mvc.perform(post("/orchids").contentType(MediaType.APPLICATION_JSON)
                        .content(payload("  Lan hồ điệp  ", true, false)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.orchidName").value("Lan hồ điệp"))
                .andExpect(jsonPath("$.natural").value(true))
                .andExpect(jsonPath("$.attractive").value(false))
                .andReturn().getResponse().getContentAsString();
        int id = mapper.readTree(body).get("orchidId").asInt();
        assertThat(id).isPositive();
        assertThat(repository.findById(id).orElseThrow().getOrchidDescription()).contains("tiếng Việt");
        mvc.perform(get("/orchids/{id}", id)).andExpect(status().isOk())
                .andExpect(jsonPath("$.orchidCategory").value("Cattleya"))
                .andExpect(jsonPath("$.orchidURL").value("https://example.com/orchid.jpg"));
        mvc.perform(put("/orchids/{id}", id).contentType(MediaType.APPLICATION_JSON)
                        .content(payload("Lan cập nhật", false, true)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.orchidId").value(id))
                .andExpect(jsonPath("$.natural").value(false)).andExpect(jsonPath("$.attractive").value(true));
        assertThat(repository.findById(id).orElseThrow().getOrchidName()).isEqualTo("Lan cập nhật");
        mvc.perform(delete("/orchids/{id}", id)).andExpect(status().isNoContent()).andExpect(content().string(""));
        mvc.perform(get("/orchids/{id}", id)).andExpect(status().isNotFound());
        assertThat(repository.existsById(id)).isFalse();
    }

    @ParameterizedTest
    @ValueSource(strings = {"", "   "})
    void blankNameIsRejectedWithoutWriting(String name) throws Exception {
        mvc.perform(post("/orchids").contentType(MediaType.APPLICATION_JSON).content(payload(name, true, true)))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.errors.orchidName").exists());
        assertThat(repository.count()).isZero();
    }

    @Test
    void oversizedDescriptionAndUnsafeImageUrlAreRejected() throws Exception {
        JsonNode base = mapper.readTree(payload("Orchid", true, true));
        var longDescription = base.deepCopy();
        ((com.fasterxml.jackson.databind.node.ObjectNode) longDescription).put("orchidDescription", "a".repeat(1001));
        mvc.perform(post("/orchids").contentType(MediaType.APPLICATION_JSON).content(longDescription.toString()))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.errors.orchidDescription").exists());
        var unsafeUrl = base.deepCopy();
        ((com.fasterxml.jackson.databind.node.ObjectNode) unsafeUrl).put("orchidURL", "javascript:alert(1)");
        mvc.perform(post("/orchids").contentType(MediaType.APPLICATION_JSON).content(unsafeUrl.toString()))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.errors.orchidURL").exists());
        assertThat(repository.count()).isZero();
    }

    @Test
    void clientCannotChooseOrReplaceIdentity() throws Exception {
        var json = (com.fasterxml.jackson.databind.node.ObjectNode) mapper.readTree(payload("Original", true, false));
        json.put("orchidId", 900001);
        String body = mvc.perform(post("/orchids").contentType(MediaType.APPLICATION_JSON).content(json.toString()))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
        int id = mapper.readTree(body).get("orchidId").asInt();
        assertThat(id).isNotEqualTo(900001);
        json.put("orchidName", "Updated");
        mvc.perform(put("/orchids/{id}", id).contentType(MediaType.APPLICATION_JSON).content(json.toString()))
                .andExpect(status().isOk()).andExpect(jsonPath("$.orchidId").value(id));
        assertThat(repository.count()).isEqualTo(1);
    }

    @Test
    void missingIdsReturn404ForAllOperations() throws Exception {
        mvc.perform(get("/orchids/2147483647")).andExpect(status().isNotFound());
        mvc.perform(put("/orchids/2147483647").contentType(MediaType.APPLICATION_JSON)
                .content(payload("Missing", false, false))).andExpect(status().isNotFound());
        mvc.perform(delete("/orchids/2147483647")).andExpect(status().isNotFound());
        assertThat(repository.count()).isZero();
    }

    @Test
    void nullOptionalFieldsAreSupported() throws Exception {
        mvc.perform(post("/orchids").contentType(MediaType.APPLICATION_JSON).content("{\"orchidName\":\"Minimal\"}"))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.natural").value(false))
                .andExpect(jsonPath("$.attractive").value(false));
    }

    @Test
    void malformedJsonAndInvalidPathReturn400() throws Exception {
        mvc.perform(post("/orchids").contentType(MediaType.APPLICATION_JSON).content("{bad"))
                .andExpect(status().isBadRequest());
        mvc.perform(get("/orchids/abc")).andExpect(status().isBadRequest());
    }

    @Test
    void wrongContentTypeReturns415() throws Exception {
        mvc.perform(post("/orchids").contentType(MediaType.TEXT_PLAIN).content("Orchid"))
                .andExpect(status().isUnsupportedMediaType());
        assertThat(repository.count()).isZero();
    }

    @Test
    void corsPreflightAllowsConfiguredOriginAndRejectsOthers() throws Exception {
        mvc.perform(options("/orchids").header("Origin", "http://localhost:5173")
                .header("Access-Control-Request-Method", "POST")
                .header("Access-Control-Request-Headers", "content-type"))
                .andExpect(status().isOk()).andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
        mvc.perform(options("/orchids").header("Origin", "https://untrusted.example")
                .header("Access-Control-Request-Method", "DELETE"))
                .andExpect(status().isForbidden()).andExpect(header().doesNotExist("Access-Control-Allow-Origin"));
    }

    @Test
    void collectionPathHasNoTrailingSlash() throws Exception {
        mvc.perform(get("/orchids/")).andExpect(status().isNotFound());
        mvc.perform(get("/orchids")).andExpect(status().isOk());
    }
}
