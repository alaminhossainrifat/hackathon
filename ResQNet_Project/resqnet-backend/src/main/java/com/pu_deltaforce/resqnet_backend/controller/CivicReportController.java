package com.pu_deltaforce.resqnet_backend.controller;


import com.pu_deltaforce.resqnet_backend.dto.CivicReportRequest;
import com.pu_deltaforce.resqnet_backend.model.CivicReport;
import com.pu_deltaforce.resqnet_backend.service.CivicReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/civic-reports")
@RequiredArgsConstructor
public class CivicReportController {

    private final CivicReportService service;

    @PostMapping
    public ResponseEntity<CivicReport> create(@RequestBody CivicReportRequest request) {
        return ResponseEntity.ok(service.createReport(request));
    }

    @GetMapping
    public ResponseEntity<List<CivicReport>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<CivicReport>> getByStatus(
            @PathVariable CivicReport.ReportStatus status) {
        return ResponseEntity.ok(service.getByStatus(status));
    }

    @GetMapping("/type/{reportType}")
    public ResponseEntity<List<CivicReport>> getByType(
            @PathVariable CivicReport.ReportType reportType) {
        return ResponseEntity.ok(service.getByType(reportType));
    }

    @GetMapping("/search/{location}")
    public ResponseEntity<List<CivicReport>> searchByLocation(
            @PathVariable String location) {
        return ResponseEntity.ok(service.searchByLocation(location));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<CivicReport> updateStatus(
            @PathVariable Long id,
            @RequestParam CivicReport.ReportStatus status) {
        return ResponseEntity.ok(service.updateStatus(id, status));
    }
}
