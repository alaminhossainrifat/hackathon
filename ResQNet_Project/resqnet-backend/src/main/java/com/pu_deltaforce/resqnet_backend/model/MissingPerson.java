package com.pu_deltaforce.resqnet_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "missing_persons")
@Data
public class MissingPerson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private Integer age;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(nullable = false)
    private String lastSeenLocation;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String reporterName;

    @Column(nullable = false)
    private String reporterPhone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Column(nullable = false)
    private LocalDateTime reportedAt;

    public enum Gender {
        MALE, FEMALE, OTHER
    }

    public enum Status {
        MISSING, FOUND
    }

    @PrePersist
    public void prePersist() {
        this.status = Status.MISSING;
        this.reportedAt = LocalDateTime.now();
    }
}