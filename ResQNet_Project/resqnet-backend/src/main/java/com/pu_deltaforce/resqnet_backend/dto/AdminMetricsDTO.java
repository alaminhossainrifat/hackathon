package com.pu_deltaforce.resqnet_backend.dto;

import lombok.Data;

@Data
public class AdminMetricsDTO {
    private long totalUsers;
    private long totalVolunteers;
    private long totalActiveSos;
    private long totalActiveSafeZones;
}