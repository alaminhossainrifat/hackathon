package com.pu_deltaforce.resqnet_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "sos_alerts")
@Data
public class SosAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String senderName;

    @Column(nullable = false)
    private String senderPhone;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SosStatus status;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public enum SosStatus {
        ACTIVE, RESOLVED
    }

    @PrePersist
    public void prePersist() {
        this.status = SosStatus.ACTIVE;
        this.createdAt = LocalDateTime.now();
    }
}
