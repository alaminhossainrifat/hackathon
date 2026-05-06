package com.pu_deltaforce.resqnet_backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class SosResponse {
    private Long sosId;
    private String message;
    private NearestInfo nearest;

    @Data
    public static class NearestInfo {
        private String ambulanceArea;
        private String ambulancePhone;
        private String safeZoneName;
        private String safeZoneAddress;
    }
}