package fu.se.backend.orchids;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/orchids")
public class OrchidController {
    private final OrchidService service;

    public OrchidController(OrchidService service) {
        this.service = service;
    }

    @GetMapping
    public List<Orchid> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Orchid> findById(@PathVariable int id) {
        return service.findById(id).map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Orchid> create(@Valid @RequestBody Orchid orchid) {
        Orchid created = service.create(orchid);
        return ResponseEntity.created(URI.create("/orchids/" + created.getOrchidId())).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Orchid> update(@PathVariable int id, @Valid @RequestBody Orchid orchid) {
        return service.update(id, orchid).map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        return service.delete(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
