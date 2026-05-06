package com.pu_deltaforce.resqnet_backend.dto;

import com.pu_deltaforce.resqnet_backend.model.Doctor;
import lombok.Data;

@Data
public class DoctorRequest {
    private String name;
    private String specialization;
    private String phone;
    private String hospital;
    private String area;
    private Doctor.ConsultType consultType;
}
