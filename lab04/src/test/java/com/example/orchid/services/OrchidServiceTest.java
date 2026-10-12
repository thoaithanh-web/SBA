package com.example.orchid.services;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.example.orchid.exceptions.ResourceNotFoundException;
import com.example.orchid.pojos.*;
import com.example.orchid.repositories.*;
import java.util.Optional;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class OrchidServiceTest {
  @Mock IOrchidRepository orchids;
  @Mock IOrchidCategoryRepository categories;
  @InjectMocks OrchidService service;

  Orchid input() {
    var o = new Orchid();
    o.setOrchidName(" Cattleya ");
    o.setIsNatural(true);
    o.setIsAttractive(false);
    o.setOrchidURL("/images/cattleya.svg");
    var c = new OrchidCategory();
    c.setCategoryId(1L);
    o.setOrchidCategory(c);
    return o;
  }

  @Test
  void createResolvesManagedCategoryAndIgnoresIncomingId() {
    var managed = new OrchidCategory("Cattleya");
    managed.setCategoryId(1L);
    when(categories.findById(1L)).thenReturn(Optional.of(managed));
    when(orchids.save(any())).thenAnswer(a -> a.getArgument(0));
    var source = input();
    source.setOrchidID(999L);
    var saved = service.create(source);
    assertThat(saved.getOrchidID()).isNull();
    assertThat(saved.getOrchidCategory()).isSameAs(managed);
    assertThat(saved.getOrchidName()).isEqualTo("Cattleya");
  }

  @Test
  void missingCategoryNeverSaves() {
    when(categories.findById(1L)).thenReturn(Optional.empty());
    assertThatThrownBy(() -> service.create(input())).isInstanceOf(IllegalArgumentException.class);
    verify(orchids, never()).save(any());
  }

  @Test
  void absentCategoryIdNeverSaves() {
    var o = input();
    o.getOrchidCategory().setCategoryId(null);
    assertThatThrownBy(() -> service.create(o)).hasMessage("categoryId is required");
    verifyNoInteractions(orchids);
  }

  @Test
  void missingOrchidThrows() {
    when(orchids.findById(9L)).thenReturn(Optional.empty());
    assertThatThrownBy(() -> service.getById(9L)).isInstanceOf(ResourceNotFoundException.class);
  }

  @Test
  void deleteDelegatesOnlyAfterLookup() {
    var found = input();
    when(orchids.findById(1L)).thenReturn(Optional.of(found));
    service.delete(1L);
    verify(orchids).delete(found);
  }
}
