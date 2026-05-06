package com.pu_deltaforce.resqnet_backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "blood_banks")
@Data
public class BloodBank {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String donorName;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String area;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BloodGroup bloodGroup;

    private boolean available;

    public enum BloodGroup {
        A_POSITIVE, A_NEGATIVE,
        B_POSITIVE, B_NEGATIVE,
        O_POSITIVE, O_NEGATIVE,
        AB_POSITIVE, AB_NEGATIVE
    }

    @PrePersist
    public void prePersist() {
        this.available = true;
    }
}
