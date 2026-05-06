package com.pu_deltaforce.resqnet_backend.dto;

import lombok.Data;

@Data
public class SosRequest {
    private String senderName;
    private String senderPhone;
    private Double latitude;
    private Double longitude;
    private String message;
}