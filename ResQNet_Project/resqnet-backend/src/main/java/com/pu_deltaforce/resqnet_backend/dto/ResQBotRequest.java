package com.pu_deltaforce.resqnet_backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class ResQBotRequest {
    private String provider; // "claude" | "openai" | "gemini"
    private String apiKey;
    private String message;
    private List<MessageDto> history;

    @Data
    public static class MessageDto {
        private String role;
        private String content;
    }
}