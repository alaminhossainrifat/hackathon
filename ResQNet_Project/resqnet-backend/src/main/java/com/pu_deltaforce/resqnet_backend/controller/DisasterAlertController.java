package com.pu_deltaforce.resqnet_backend.controller;

import com.pu_deltaforce.resqnet_backend.dto.DisasterAlertRequest;
import com.pu_deltaforce.resqnet_backend.model.DisasterAlert;
import com.pu_deltaforce.resqnet_backend.service.DisasterAlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/disasters")
@RequiredArgsConstructor
public class DisasterAlertController {

    private final DisasterAlertService service;

    @PostMapping
    public ResponseEntity<DisasterAlert> createAlert(@RequestBody DisasterAlertRequest request) {
        return ResponseEntity.ok(service.createAlert(request));
    }

    @GetMapping
    public ResponseEntity<List<DisasterAlert>> getActiveAlerts() {
        return ResponseEntity.ok(service.getAllActiveAlerts());
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<DisasterAlert> deactivateAlert(@PathVariable Long id) {
        return ResponseEntity.ok(service.deactivateAlert(id));
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<DisasterAlert> activateAlert(@PathVariable Long id) {
        return ResponseEntity.ok(service.activateAlert(id));
    }
}
