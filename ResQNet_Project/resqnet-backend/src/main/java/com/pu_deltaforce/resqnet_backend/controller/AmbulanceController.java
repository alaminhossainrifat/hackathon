package com.pu_deltaforce.resqnet_backend.controller;

import com.pu_deltaforce.resqnet_backend.dto.AmbulanceRequest;
import com.pu_deltaforce.resqnet_backend.model.Ambulance;
import com.pu_deltaforce.resqnet_backend.service.AmbulanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ambulances")
@RequiredArgsConstructor
public class AmbulanceController {

    private final AmbulanceService service;

    @PostMapping
    public ResponseEntity<Ambulance> add(@RequestBody AmbulanceRequest request) {
        return ResponseEntity.ok(service.addAmbulance(request));
    }

    @GetMapping
    public ResponseEntity<List<Ambulance>> getAvailable() {
        return ResponseEntity.ok(service.getAvailable());
    }

    @GetMapping("/area/{area}")
    public ResponseEntity<List<Ambulance>> getByArea(@PathVariable String area) {
        return ResponseEntity.ok(service.getAvailableByArea(area));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Ambulance> updateStatus(
            @PathVariable Long id,
            @RequestParam Ambulance.AmbulanceStatus status) {
        return ResponseEntity.ok(service.updateStatus(id, status));
    }

    @PutMapping("/{id}/location")
    public ResponseEntity<Ambulance> updateLocation(
            @PathVariable Long id,
            @RequestParam Double lat,
            @RequestParam Double lng) {
        return ResponseEntity.ok(service.updateLocation(id, lat, lng));
    }
}
