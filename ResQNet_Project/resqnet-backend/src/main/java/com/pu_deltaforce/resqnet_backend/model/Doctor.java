package com.pu_deltaforce.resqnet_backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "doctors")
@Data
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String specialization;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String hospital;

    @Column(nullable = false)
    private String area;

    private boolean available;

    @Enumerated(EnumType.STRING)
    private Doctor.ConsultType consultType;

    public enum ConsultType {
        IN_PERSON, ONLINE, BOTH
    }

    @PrePersist
    public void prePersist() {
        this.available = true;
    }
}