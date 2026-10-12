package com.example.orchid.services;

import com.example.orchid.pojos.Orchid;
import java.util.List;

public interface IOrchidService {
  List<Orchid> getAll();

  List<Orchid> searchByName(String name);

  Orchid getById(Long id);

  Orchid create(Orchid input);

  Orchid update(Long id, Orchid input);

  void delete(Long id);
}
