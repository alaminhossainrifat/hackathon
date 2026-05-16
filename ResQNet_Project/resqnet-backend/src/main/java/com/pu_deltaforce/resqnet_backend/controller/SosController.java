package com.pu_deltaforce.resqnet_backend.controller;

import com.pu_deltaforce.resqnet_backend.dto.SosRequest;
import com.pu_deltaforce.resqnet_backend.dto.SosResponse;
import com.pu_deltaforce.resqnet_backend.model.SosAlert;
import com.pu_deltaforce.resqnet_backend.service.SosService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sos")
@RequiredArgsConstructor
public class SosController {

    private final SosService service;

    @PostMapping("/trigger")
    public ResponseEntity<SosResponse> triggerSos(@RequestBody SosRequest request) {
        // Extracting logged-in user's email from the JWT token
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(service.triggerSos(request, email));
    }

    @GetMapping("/active")
    public ResponseEntity<List<SosAlert>> getActive() {
        return ResponseEntity.ok(service.getActiveSos());
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<SosAlert> resolve(@PathVariable Long id) {
        return ResponseEntity.ok(service.resolvesSos(id));
    }
}