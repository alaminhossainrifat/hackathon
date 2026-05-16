package com.pu_deltaforce.resqnet_backend.controller;

import com.pu_deltaforce.resqnet_backend.dto.AdminMetricsDTO;
import com.pu_deltaforce.resqnet_backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}