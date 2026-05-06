package com.pu_deltaforce.resqnet_backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "ambulances")
@Data
public class Ambulance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String vehicleNumber;

    @Column(nullable = false)
    private String driverName;

    @Column(nullable = false)
    private String driverPhone;

    @Column(nullable = false)
    private String area;

    private Double currentLatitude;
    private Double currentLongitude;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AmbulanceStatus status;

    public enum AmbulanceStatus {
        AVAILABLE, ON_DUTY, MAINTENANCE
    }

    @PrePersist
    public void prePersist() {
        this.status = AmbulanceStatus.AVAILABLE;
    }
}
