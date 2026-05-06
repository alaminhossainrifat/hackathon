package com.pu_deltaforce.resqnet_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "civic_reports")
@Data
public class CivicReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String reporterName;

    @Column(nullable = false)
    private String reporterPhone;

    @Column(nullable = false)
    private String location;

    private Double latitude;
    private Double longitude;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportType reportType;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportStatus status;

    @Column(nullable = false)
    private LocalDateTime reportedAt;

    public enum ReportType {
        ROAD_DAMAGE, WATERLOGGING, POWER_OUTAGE,
        GAS_LEAK, FIRE, OTHER
    }

    public enum ReportStatus {
        PENDING, IN_PROGRESS, RESOLVED
    }

    @PrePersist
    public void prePersist() {
        this.status = ReportStatus.PENDING;
        this.reportedAt = LocalDateTime.now();
    }
}