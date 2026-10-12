package fu.se.backend.orchids;

import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@EnabledIfEnvironmentVariable(named = "SQLSERVER_TESTS", matches = "true")
class SQLServerIntegrationTest {
    @Autowired TestRestTemplate rest;
    @Autowired JdbcTemplate jdbc;

    @Test
    void httpCrudMatchesActualSqlServerRows() {
        assertThat(jdbc.queryForObject("SELECT DB_NAME()", String.class)).isEqualTo("OrchidManagementDB");
        String name = "Kiểm thử SQL " + UUID.randomUUID();
        Map<String, Object> payload = Map.of("orchidName", name, "natural", true, "attractive", false,
                "orchidDescription", "Tiếng Việt được lưu nguyên vẹn", "orchidCategory", "Cattleya",
                "orchidURL", "https://example.com/test.jpg");
        var created = rest.postForEntity("/orchids", payload, Orchid.class);
        assertThat(created.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        int id = created.getBody().getOrchidId();
        try {
            assertThat(jdbc.queryForObject("SELECT OrchidName FROM dbo.Orchid WHERE OrchidID=?", String.class, id)).isEqualTo(name);
            assertThat(jdbc.queryForObject("SELECT IsNatural FROM dbo.Orchid WHERE OrchidID=?", Boolean.class, id)).isTrue();
            var input = created.getBody();
            input.setOrchidName(name + " updated");
            input.setNatural(false);
            input.setAttractive(true);
            var updated = rest.exchange("/orchids/" + id, HttpMethod.PUT, new HttpEntity<>(input), Orchid.class);
            assertThat(updated.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(updated.getBody().getOrchidId()).isEqualTo(id);
            assertThat(jdbc.queryForObject("SELECT IsAttractive FROM dbo.Orchid WHERE OrchidID=?", Boolean.class, id)).isTrue();
            assertThat(jdbc.queryForObject("SELECT IsNatural FROM dbo.Orchid WHERE OrchidID=?", Boolean.class, id)).isFalse();
            assertThat(jdbc.queryForObject("SELECT OrchidDescription FROM dbo.Orchid WHERE OrchidID=?", String.class, id)).isEqualTo("Tiếng Việt được lưu nguyên vẹn");
            var deleted = rest.exchange("/orchids/" + id, HttpMethod.DELETE, HttpEntity.EMPTY, Void.class);
            assertThat(deleted.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
            assertThat(rest.getForEntity("/orchids/" + id, String.class).getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
            assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM dbo.Orchid WHERE OrchidID=?", Integer.class, id)).isZero();
        } finally {
            jdbc.update("DELETE FROM dbo.Orchid WHERE OrchidID=?", id);
        }
    }
}
