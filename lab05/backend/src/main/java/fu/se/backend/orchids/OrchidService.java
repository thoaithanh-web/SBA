package fu.se.backend.orchids;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class OrchidService {
    private final OrchidRepository repository;

    public OrchidService(OrchidRepository repository) {
        this.repository = repository;
    }

    public List<Orchid> findAll() {
        return repository.findAll(Sort.by("orchidId").descending());
    }

    public Optional<Orchid> findById(int id) {
        return repository.findById(id);
    }

    @Transactional
    public Orchid create(Orchid orchid) {
        orchid.setOrchidId(null);
        normalize(orchid);
        return repository.save(orchid);
    }

    @Transactional
    public Optional<Orchid> update(int id, Orchid input) {
        return repository.findById(id).map(current -> {
            current.setOrchidName(input.getOrchidName());
            current.setNatural(input.isNatural());
            current.setOrchidDescription(input.getOrchidDescription());
            current.setOrchidCategory(input.getOrchidCategory());
            current.setAttractive(input.isAttractive());
            current.setOrchidURL(input.getOrchidURL());
            normalize(current);
            return repository.save(current);
        });
    }

    @Transactional
    public boolean delete(int id) {
        return repository.findById(id).map(orchid -> {
            repository.delete(orchid);
            return true;
        }).orElse(false);
    }

    private void normalize(Orchid orchid) {
        orchid.setOrchidName(orchid.getOrchidName().trim());
        orchid.setOrchidCategory(trim(orchid.getOrchidCategory()));
        orchid.setOrchidDescription(trim(orchid.getOrchidDescription()));
        orchid.setOrchidURL(trim(orchid.getOrchidURL()));
    }

    private String trim(String value) {
        return value == null ? null : value.trim();
    }
}
