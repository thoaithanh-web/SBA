package com.example.orchid.controllers;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.orchid.exceptions.ResourceNotFoundException;
import com.example.orchid.pojos.Orchid;
import com.example.orchid.services.IOrchidService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(OrchidController.class)
class OrchidControllerTest {
  @Autowired MockMvc mvc;
  @MockitoBean IOrchidService service;
  String body =
      "{\"orchidName\":\"Cattleya\",\"isNatural\":true,\"isAttractive\":false,\"orchidDescription\":\"Demo\",\"orchidURL\":\"/images/orchid.svg\",\"orchidCategory\":{\"categoryId\":1}}";

  Orchid item() {
    var o = new Orchid();
    o.setOrchidID(7L);
    o.setOrchidName("Cattleya");
    return o;
  }

  @Test
  void listAndLegacyAliasReturn200() throws Exception {
    when(service.getAll()).thenReturn(List.of(item()));
    mvc.perform(get("/api/orchids"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].orchidName").value("Cattleya"));
    mvc.perform(get("/orchids/")).andExpect(status().isOk());
  }

  @Test
  void nameSearchDelegates() throws Exception {
    when(service.searchByName("cat")).thenReturn(List.of(item()));
    mvc.perform(get("/api/orchids?name=cat")).andExpect(status().isOk());
    verify(service).searchByName("cat");
  }

  @Test
  void detailMissingReturns404() throws Exception {
    when(service.getById(999L)).thenThrow(new ResourceNotFoundException("Missing"));
    mvc.perform(get("/api/orchids/999")).andExpect(status().isNotFound());
  }

  @Test
  void createReturns201AndLocation() throws Exception {
    when(service.create(any())).thenReturn(item());
    mvc.perform(post("/api/orchids").contentType(MediaType.APPLICATION_JSON).content(body))
        .andExpect(status().isCreated())
        .andExpect(header().string("Location", "http://localhost/api/orchids/7"));
  }

  @Test
  void invalidBodyReturns400() throws Exception {
    mvc.perform(post("/api/orchids").contentType(MediaType.APPLICATION_JSON).content("{}"))
        .andExpect(status().isBadRequest());
    verifyNoInteractions(service);
  }

  @Test
  void invalidCategoryReturns400() throws Exception {
    when(service.create(any())).thenThrow(new IllegalArgumentException("Category not found"));
    mvc.perform(post("/api/orchids").contentType(MediaType.APPLICATION_JSON).content(body))
        .andExpect(status().isBadRequest());
  }

  @Test
  void updateReturns200() throws Exception {
    when(service.update(eq(7L), any())).thenReturn(item());
    mvc.perform(put("/api/orchids/7").contentType(MediaType.APPLICATION_JSON).content(body))
        .andExpect(status().isOk());
  }

  @Test
  void deleteReturns204() throws Exception {
    mvc.perform(delete("/api/orchids/7"))
        .andExpect(status().isNoContent())
        .andExpect(content().string(""));
    verify(service).delete(7L);
  }

  @Test
  void invalidPathAndMalformedJsonReturn400() throws Exception {
    mvc.perform(get("/api/orchids/nope")).andExpect(status().isBadRequest());
    mvc.perform(post("/api/orchids").contentType(MediaType.APPLICATION_JSON).content("{"))
        .andExpect(status().isBadRequest());
  }
}
