package com.pu_deltaforce.resqnet_backend.dto;

import lombok.Data;

@Data
public class ResQBotResponse {
    private String reply;
    private String provider;

    public ResQBotResponse(String reply, String provider) {
        this.reply = reply;
        this.provider = provider;
    }
}