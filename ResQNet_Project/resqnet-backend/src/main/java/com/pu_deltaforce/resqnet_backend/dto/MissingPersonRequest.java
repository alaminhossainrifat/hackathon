package com.pu_deltaforce.resqnet_backend.dto;

import com.pu_deltaforce.resqnet_backend.model.MissingPerson;
import lombok.Data;

@Data
public class MissingPersonRequest {
    private String name;
    private Integer age;
    private MissingPerson.Gender gender;
    private String lastSeenLocation;
    private String description;
    private String reporterName;
    private String reporterPhone;
}