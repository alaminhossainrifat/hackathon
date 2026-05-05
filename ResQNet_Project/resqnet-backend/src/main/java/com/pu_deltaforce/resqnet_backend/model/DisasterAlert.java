package com.pu_deltaforce.resqnet_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "disaster_alerts")
@Data
public class DisasterAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AlertType alertType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Severity severity;

    @Column(nullable = false)
    private String location;

    private Double latitude;
    private Double longitude;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private boolean active;

    public enum AlertType {
        FLOOD, CYCLONE, EARTHQUAKE, FIRE, OTHER
    }

    public enum Severity {
        LOW, MEDIUM, HIGH, CRITICAL
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.active = true;
    }
}
