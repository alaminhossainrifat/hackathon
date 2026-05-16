package com.pu_deltaforce.resqnet_backend.controller;

import com.pu_deltaforce.resqnet_backend.dto.AdminMetricsDTO;
import com.pu_deltaforce.resqnet_backend.dto.UserDTO;
import com.pu_deltaforce.resqnet_backend.model.SosAlert;
import com.pu_deltaforce.resqnet_backend.model.User;
import com.pu_deltaforce.resqnet_backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/test")
    public ResponseEntity<String> testAdminAccess() {
        return ResponseEntity.ok("✅ Welcome Admin! Your RBAC configuration is working perfectly.");
    }

    // Endpoint for Dashboard Metrics
    @GetMapping("/metrics")
    public ResponseEntity<AdminMetricsDTO> getDashboardMetrics() {
        return ResponseEntity.ok(adminService.getDashboardMetrics());
    }

    // --- User Management Endpoints ---

    // Get the list of all users
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    // Update the role of a specific user
    @PutMapping("/users/{id}/role")
    public ResponseEntity<UserDTO> updateUserRole(
            @PathVariable Long id,
            @RequestParam User.Role role) {
        return ResponseEntity.ok(adminService.updateUserRole(id, role));
    }

    // --- SOS Command Center Endpoints ---

    // Get all SOS alerts
    @GetMapping("/sos")
    public ResponseEntity<List<SosAlert>> getAllSosAlerts() {
        return ResponseEntity.ok(adminService.getAllSosAlerts());
    }

    // Update the status of a specific SOS alert
    @PutMapping("/sos/{id}/status")
    public ResponseEntity<SosAlert> updateSosStatus(
            @PathVariable Long id,
            @RequestParam SosAlert.SosStatus status) {
        return ResponseEntity.ok(adminService.updateSosStatus(id, status));
    }
}