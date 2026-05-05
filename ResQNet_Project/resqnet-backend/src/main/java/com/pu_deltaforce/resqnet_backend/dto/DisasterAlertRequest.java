package com.pu_deltaforce.resqnet_backend.dto;

import com.pu_deltaforce.resqnet_backend.model.DisasterAlert;
import lombok.Data;

@Data
public class DisasterAlertRequest {
    private String title;
    private String description;
    private DisasterAlert.AlertType alertType;
    private DisasterAlert.Severity severity;
    private String location;
    private Double latitude;
    private Double longitude;
}
