package com.pu_deltaforce.resqnet_backend.dto;

import com.pu_deltaforce.resqnet_backend.model.BloodBank;
import lombok.Data;

@Data
public class BloodBankRequest {
    private String donorName;
    private String phone;
    private String area;
    private BloodBank.BloodGroup bloodGroup;
}