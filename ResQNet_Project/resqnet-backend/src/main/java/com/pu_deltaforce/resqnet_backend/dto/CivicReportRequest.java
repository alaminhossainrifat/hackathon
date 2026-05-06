package com.pu_deltaforce.resqnet_backend.dto;

import com.pu_deltaforce.resqnet_backend.model.CivicReport;
import lombok.Data;

@Data
public class CivicReportRequest {
    private String reporterName;
    private String reporterPhone;
    private String location;
    private Double latitude;
    private Double longitude;
    private CivicReport.ReportType reportType;
    private String description;
}