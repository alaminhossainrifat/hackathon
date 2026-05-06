package com.pu_deltaforce.resqnet_backend.controller;

import com.pu_deltaforce.resqnet_backend.dto.SafeZoneRequest;
import com.pu_deltaforce.resqnet_backend.model.SafeZone;
import com.pu_deltaforce.resqnet_backend.service.SafeZoneService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/safezones")
@RequiredArgsConstructor
public class SafeZoneController {

    private final SafeZoneService service;

    @PostMapping
    public ResponseEntity<SafeZone> create(@RequestBody SafeZoneRequest request) {
        return ResponseEntity.ok(service.createSafeZone(request));
    }

    @GetMapping
    public ResponseEntity<List<SafeZone>> getAll() {
        return ResponseEntity.ok(service.getAllAvailable());
    }

    @GetMapping("/type/{zoneType}")
    public ResponseEntity<List<SafeZone>> getByType(@PathVariable SafeZone.ZoneType zoneType) {
        return ResponseEntity.ok(service.getByType(zoneType));
    }

    @PutMapping("/{id}/occupancy")
    public ResponseEntity<SafeZone> updateOccupancy(
            @PathVariable Long id,
            @RequestParam Integer occupancy) {
        return ResponseEntity.ok(service.updateOccupancy(id, occupancy));
    }
    @PutMapping("/{id}/toggle-availability")
    public ResponseEntity<SafeZone> toggleAvailability(@PathVariable Long id) {
        return ResponseEntity.ok(service.toggleAvailability(id));
    }
}
