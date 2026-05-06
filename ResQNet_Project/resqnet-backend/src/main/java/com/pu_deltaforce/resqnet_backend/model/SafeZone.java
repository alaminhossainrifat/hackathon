package com.pu_deltaforce.resqnet_backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "safe_zones")
@Data
public class SafeZone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ZoneType zoneType;

    private Integer capacity;
    private Integer currentOccupancy;
    private boolean available;

    public enum ZoneType {
        SHELTER, HOSPITAL, SCHOOL, MOSQUE, OTHER
    }

    @PrePersist
    public void prePersist() {
        this.available = true;
        if (this.currentOccupancy == null) this.currentOccupancy = 0;
    }
}