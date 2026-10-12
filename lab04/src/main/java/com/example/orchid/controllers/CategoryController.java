package com.example.orchid.controllers;

import com.example.orchid.exceptions.ApiError;
import com.example.orchid.pojos.OrchidCategory;
import com.example.orchid.services.CategoryService;
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
@RequestMapping("/api/categories")
public class CategoryController {
  private final CategoryService service;

  public CategoryController(CategoryService service) {
    this.service = service;
  }

  @ApiResponses({@ApiResponse(responseCode = "200", description = "Success")})
  @GetMapping
  public List<OrchidCategory> list() {
    return service.getAll();
  }

  @ApiResponses({
    @ApiResponse(responseCode = "201", description = "Created with Location header"),
    @ApiResponse(
        responseCode = "400",
        description = "Invalid request",
        content = @Content(schema = @Schema(implementation = ApiError.class))),
    @ApiResponse(
        responseCode = "409",
        description = "Conflicting record or relationship",
        content = @Content(schema = @Schema(implementation = ApiError.class)))
  })
  @PostMapping
  public ResponseEntity<OrchidCategory> create(@Valid @RequestBody OrchidCategory input) {
    OrchidCategory created = service.create(input);
    return ResponseEntity.created(
            ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getCategoryId())
                .toUri())
        .body(created);
  }

  @ApiResponses({
    @ApiResponse(responseCode = "204", description = "Deleted with empty body"),
    @ApiResponse(
        responseCode = "404",
        description = "Resource not found",
        content = @Content(schema = @Schema(implementation = ApiError.class))),
    @ApiResponse(
        responseCode = "409",
        description = "Conflicting record or relationship",
        content = @Content(schema = @Schema(implementation = ApiError.class)))
  })
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    service.delete(id);
    return ResponseEntity.noContent().build();
  }
}
