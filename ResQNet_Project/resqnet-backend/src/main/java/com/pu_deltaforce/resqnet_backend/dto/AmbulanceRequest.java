package com.pu_deltaforce.resqnet_backend.dto;

import lombok.Data;

@Data
public class AmbulanceRequest {
    private String vehicleNumber;
    private String driverName;
    private String driverPhone;
    private String area;
    private Double currentLatitude;
    private Double currentLongitude;
}
