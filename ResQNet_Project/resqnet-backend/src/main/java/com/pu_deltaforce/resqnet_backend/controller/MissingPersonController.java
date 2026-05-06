package com.pu_deltaforce.resqnet_backend.controller;

import com.pu_deltaforce.resqnet_backend.dto.MissingPersonRequest;
import com.pu_deltaforce.resqnet_backend.model.MissingPerson;
import com.pu_deltaforce.resqnet_backend.service.MissingPersonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/missing-persons")
@RequiredArgsConstructor
public class MissingPersonController {

    private final MissingPersonService service;

    @PostMapping
    public ResponseEntity<MissingPerson> report(@RequestBody MissingPersonRequest request) {
        return ResponseEntity.ok(service.report(request));
    }

    @GetMapping
    public ResponseEntity<List<MissingPerson>> getAllMissing() {
        return ResponseEntity.ok(service.getAllMissing());
    }

    @GetMapping("/search/name/{name}")
    public ResponseEntity<List<MissingPerson>> searchByName(@PathVariable String name) {
        return ResponseEntity.ok(service.searchByName(name));
    }

    @GetMapping("/search/location/{location}")
    public ResponseEntity<List<MissingPerson>> searchByLocation(@PathVariable String location) {
        return ResponseEntity.ok(service.searchByLocation(location));
    }

    @PutMapping("/{id}/found")
    public ResponseEntity<MissingPerson> markAsFound(@PathVariable Long id) {
        return ResponseEntity.ok(service.markAsFound(id));
    }
}