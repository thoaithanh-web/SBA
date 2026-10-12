package com.example.orchid.repositories;

import com.example.orchid.pojos.Orchid;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IOrchidRepository extends JpaRepository<Orchid, Long> {
  List<Orchid> findByOrchidNameContainingIgnoreCase(String name);

  boolean existsByOrchidCategoryCategoryId(Long categoryId);
}
