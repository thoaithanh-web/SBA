package com.example.orchid.pojos;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.util.*;

@Entity
@Table(name = "orchids")
public class Orchid {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "orchid_id")
  private Long orchidID;

  @NotBlank
  @Size(max = 150)
  @Column(nullable = false, length = 150)
  private String orchidName;

  @NotNull private Boolean isNatural;

  @Size(max = 1000)
  @Column(length = 1000)
  private String orchidDescription;

  @NotNull
  @ManyToOne(optional = false)
  @JoinColumn(name = "category_id", nullable = false)
  private OrchidCategory orchidCategory;

  @NotNull private Boolean isAttractive;

  @NotBlank
  @Size(max = 500)
  @Column(length = 500)
  private String orchidURL;

  public Orchid() {}

  public Long getOrchidID() {
    return orchidID;
  }

  public void setOrchidID(Long value) {
    this.orchidID = value;
  }

  public String getOrchidName() {
    return orchidName;
  }

  public void setOrchidName(String value) {
    this.orchidName = value;
  }

  @JsonProperty("isNatural")
  public Boolean getIsNatural() {
    return isNatural;
  }

  public void setIsNatural(Boolean value) {
    this.isNatural = value;
  }

  public String getOrchidDescription() {
    return orchidDescription;
  }

  public void setOrchidDescription(String value) {
    this.orchidDescription = value;
  }

  public OrchidCategory getOrchidCategory() {
    return orchidCategory;
  }

  public void setOrchidCategory(OrchidCategory value) {
    this.orchidCategory = value;
  }

  @JsonProperty("isAttractive")
  public Boolean getIsAttractive() {
    return isAttractive;
  }

  public void setIsAttractive(Boolean value) {
    this.isAttractive = value;
  }

  public String getOrchidURL() {
    return orchidURL;
  }

  public void setOrchidURL(String value) {
    this.orchidURL = value;
  }
}
