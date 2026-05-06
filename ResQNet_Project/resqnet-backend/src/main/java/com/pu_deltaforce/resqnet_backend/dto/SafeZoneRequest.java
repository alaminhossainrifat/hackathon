package com.pu_deltaforce.resqnet_backend.dto;

import com.pu_deltaforce.resqnet_backend.model.SafeZone;
import lombok.Data;

@Data
public class SafeZoneRequest {
    private String name;
    private String address;
    private Double latitude;
    private Double longitude;
    private SafeZone.ZoneType zoneType;
    private Integer capacity;
}
