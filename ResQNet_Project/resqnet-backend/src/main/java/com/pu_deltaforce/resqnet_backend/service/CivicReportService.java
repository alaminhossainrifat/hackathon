package com.pu_deltaforce.resqnet_backend.service;


import com.pu_deltaforce.resqnet_backend.dto.CivicReportRequest;
import com.pu_deltaforce.resqnet_backend.model.CivicReport;
import com.pu_deltaforce.resqnet_backend.repository.CivicReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CivicReportService {

    private final CivicReportRepository repository;

    public CivicReport createReport(CivicReportRequest request) {
        CivicReport report = new CivicReport();
        report.setReporterName(request.getReporterName());
        report.setReporterPhone(request.getReporterPhone());
        report.setLocation(request.getLocation());
        report.setLatitude(request.getLatitude());
        report.setLongitude(request.getLongitude());
        report.setReportType(request.getReportType());
        report.setDescription(request.getDescription());
        return repository.save(report);
    }

    public List<CivicReport> getAll() {
        return repository.findAll();
    }

    public List<CivicReport> getByStatus(CivicReport.ReportStatus status) {
        return repository.findByStatus(status);
    }

    public List<CivicReport> getByType(CivicReport.ReportType reportType) {
        return repository.findByReportType(reportType);
    }

    public List<CivicReport> searchByLocation(String location) {
        return repository.searchByLocation(location);
    }

    public CivicReport updateStatus(Long id, CivicReport.ReportStatus status) {
        CivicReport report = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found!"));
        report.setStatus(status);
        return repository.save(report);
    }
}