package com.pu_deltaforce.resqnet_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String phone;
    private String bloodGroup;
    private String medicalConditions;
    private String emergencyContact1;
    private String emergencyContact2;
    private Boolean isVolunteer;
}