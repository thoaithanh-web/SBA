package com.example.orchid.controllers;

import com.example.orchid.exceptions.ApiError;
import com.example.orchid.pojos.Orchid;
import com.example.orchid.services.IOrchidService;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping({"/api/orchids", "/orchids"})
public class OrchidController {
  private final IOrchidService service;

  public OrchidController(IOrchidService service) {
    this.service = service;
  }

  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Success"),
    @ApiResponse(
        responseCode = "400",
        description = "Invalid request",
        content = @Content(schema = @Schema(implementation = ApiError.class)))
  })
  @GetMapping({"", "/"})
  public List<Orchid> list(@RequestParam(required = false) String name) {
    return name == null || name.isBlank() ? service.getAll() : service.searchByName(name);
  }

  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Success"),
    @ApiResponse(
        responseCode = "404",
        description = "Resource not found",
        content = @Content(schema = @Schema(implementation = ApiError.class)))
  })
  @GetMapping("/{id}")
  public Orchid detail(@PathVariable Long id) {
    return service.getById(id);
  }

  @ApiResponses({
    @ApiResponse(responseCode = "201", description = "Created with Location header"),
    @ApiResponse(
        responseCode = "400",
        description = "Invalid request",
        content = @Content(schema = @Schema(implementation = ApiError.class)))
  })
  @PostMapping({"", "/"})
  public ResponseEntity<Orchid> create(@Valid @RequestBody Orchid input) {
    Orchid created = service.create(input);
    return ResponseEntity.created(
            ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getOrchidID())
                .toUri())
        .body(created);
  }

  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Success"),
    @ApiResponse(
        responseCode = "400",
        description = "Invalid request",
        content = @Content(schema = @Schema(implementation = ApiError.class))),
    @ApiResponse(
        responseCode = "404",
        description = "Resource not found",
        content = @Content(schema = @Schema(implementation = ApiError.class)))
  })
  @PutMapping("/{id}")
  public Orchid update(@PathVariable Long id, @Valid @RequestBody Orchid input) {
    return service.update(id, input);
  }

  @ApiResponses({
    @ApiResponse(responseCode = "204", description = "Deleted with empty body"),
    @ApiResponse(
        responseCode = "404",
        description = "Resource not found",
        content = @Content(schema = @Schema(implementation = ApiError.class)))
  })
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    service.delete(id);
    return ResponseEntity.noContent().build();
  }
}
