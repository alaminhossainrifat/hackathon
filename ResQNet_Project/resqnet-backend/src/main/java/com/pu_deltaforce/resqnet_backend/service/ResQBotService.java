package com.pu_deltaforce.resqnet_backend.service;


import com.pu_deltaforce.resqnet_backend.dto.ResQBotRequest;
import com.pu_deltaforce.resqnet_backend.dto.ResQBotResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ArrayNode;
import tools.jackson.databind.node.ObjectNode;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResQBotService {

    private final ObjectMapper objectMapper;

    private static final String SYSTEM_PROMPT =
            "তুমি ResQBot — বাংলাদেশের দুর্যোগ ব্যবস্থাপনা AI assistant। " +
                    "বাংলা ও ইংরেজি দুটোতেই কথা বলতে পারো। " +
                    "বন্যা, ঘূর্ণিঝড়, ভূমিকম্প, অগ্নিকাণ্ড বিষয়ে সাহায্য করো। " +
                    "প্রাথমিক চিকিৎসা, নিরাপদ আশ্রয়, উদ্ধার পদ্ধতি বিষয়ে পরামর্শ দাও। " +
                    "সংক্ষিপ্ত ও কার্যকর উত্তর দাও।";

    public ResQBotResponse chat(ResQBotRequest request) {
        return switch (request.getProvider().toLowerCase()) {
            case "claude" -> callClaude(request);
            case "openai" -> callOpenAI(request);
            case "gemini" -> callGemini(request);
            case "freellm" -> callFreeLLM(request);
            default -> throw new RuntimeException("Unknown provider: " + request.getProvider());
        };
    }

    private ResQBotResponse callClaude(ResQBotRequest request) {
        WebClient client = WebClient.builder()
                .baseUrl("https://api.anthropic.com")
                .defaultHeader("x-api-key", request.getApiKey())
                .defaultHeader("anthropic-version", "2023-06-01")
                .defaultHeader("Content-Type", "application/json")
                .build();

        ObjectNode body = objectMapper.createObjectNode();
        body.put("model", "claude-sonnet-4-20250514");
        body.put("max_tokens", 1000);
        body.put("system", SYSTEM_PROMPT);

        ArrayNode messages = objectMapper.createArrayNode();
        if (request.getHistory() != null) {
            for (ResQBotRequest.MessageDto msg : request.getHistory()) {
                ObjectNode m = objectMapper.createObjectNode();
                m.put("role", msg.getRole());
                m.put("content", msg.getContent());
                messages.add(m);
            }
        }
        ObjectNode userMsg = objectMapper.createObjectNode();
        userMsg.put("role", "user");
        userMsg.put("content", request.getMessage());
        messages.add(userMsg);
        body.set("messages", messages);

        String response = client.post()
                .uri("/v1/messages")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        try {
            JsonNode json = objectMapper.readTree(response);
            String reply = json.get("content").get(0).get("text").asText();
            return new ResQBotResponse(reply, "claude");
        } catch (Exception e) {
            throw new RuntimeException("Claude parse error: " + e.getMessage());
        }
    }

    private ResQBotResponse callOpenAI(ResQBotRequest request) {
        WebClient client = WebClient.builder()
                .baseUrl("https://api.openai.com")
                .defaultHeader("Authorization", "Bearer " + request.getApiKey())
                .defaultHeader("Content-Type", "application/json")
                .build();

        ObjectNode body = objectMapper.createObjectNode();
        body.put("model", "gpt-4o-mini");
        body.put("max_tokens", 1000);

        ArrayNode messages = objectMapper.createArrayNode();
        ObjectNode systemMsg = objectMapper.createObjectNode();
        systemMsg.put("role", "system");
        systemMsg.put("content", SYSTEM_PROMPT);
        messages.add(systemMsg);

        if (request.getHistory() != null) {
            for (ResQBotRequest.MessageDto msg : request.getHistory()) {
                ObjectNode m = objectMapper.createObjectNode();
                m.put("role", msg.getRole());
                m.put("content", msg.getContent());
                messages.add(m);
            }
        }
        ObjectNode userMsg = objectMapper.createObjectNode();
        userMsg.put("role", "user");
        userMsg.put("content", request.getMessage());
        messages.add(userMsg);
        body.set("messages", messages);

        String response = client.post()
                .uri("/v1/chat/completions")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        try {
            JsonNode json = objectMapper.readTree(response);
            String reply = json.get("choices").get(0).get("message").get("content").asText();
            return new ResQBotResponse(reply, "openai");
        } catch (Exception e) {
            throw new RuntimeException("OpenAI parse error: " + e.getMessage());
        }
    }

    private ResQBotResponse callGemini(ResQBotRequest request) {
        WebClient client = WebClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com")
                .defaultHeader("Content-Type", "application/json")
                .codecs(configurer -> configurer
                        .defaultCodecs()
                        .maxInMemorySize(10 * 1024 * 1024))
                .build();

        ObjectNode body = objectMapper.createObjectNode();

        // System instruction
        ObjectNode systemInstruction = objectMapper.createObjectNode();
        ArrayNode systemParts = objectMapper.createArrayNode();
        ObjectNode systemPart = objectMapper.createObjectNode();
        systemPart.put("text", SYSTEM_PROMPT);
        systemParts.add(systemPart);
        systemInstruction.set("parts", systemParts);
        body.set("system_instruction", systemInstruction);

        ArrayNode contents = objectMapper.createArrayNode();

        if (request.getHistory() != null) {
            for (ResQBotRequest.MessageDto msg : request.getHistory()) {
                ObjectNode m = objectMapper.createObjectNode();
                m.put("role", msg.getRole().equals("assistant") ? "model" : "user");
                ArrayNode parts = objectMapper.createArrayNode();
                ObjectNode part = objectMapper.createObjectNode();
                part.put("text", msg.getContent());
                parts.add(part);
                m.set("parts", parts);
                contents.add(m);
            }
        }

        ObjectNode userMsg = objectMapper.createObjectNode();
        userMsg.put("role", "user");
        ArrayNode parts = objectMapper.createArrayNode();
        ObjectNode part = objectMapper.createObjectNode();
        part.put("text", request.getMessage());
        parts.add(part);
        userMsg.set("parts", parts);
        contents.add(userMsg);
        body.set("contents", contents);

        String response = client.post()
                .uri("/v1beta/models/gemini-2.0-flash:generateContent?key=" + request.getApiKey())
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        try {
            JsonNode json = objectMapper.readTree(response);
            String reply = json.get("candidates").get(0)
                    .get("content").get("parts").get(0).get("text").asText();
            return new ResQBotResponse(reply, "gemini");
        } catch (Exception e) {
            throw new RuntimeException("Gemini parse error: " + e.getMessage());
        }
    }

    private ResQBotResponse callFreeLLM(ResQBotRequest request) {
        WebClient client = WebClient.builder()
                .baseUrl("https://apifreellm.com")
                .defaultHeader("Authorization", "Bearer " + request.getApiKey())
                .defaultHeader("Content-Type", "application/json")
                .build();

        ObjectNode body = objectMapper.createObjectNode();
        body.put("message", request.getMessage());
        body.put("model", "apifreellm");

        String response = client.post()
                .uri("/api/v1/chat")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        try {
            JsonNode json = objectMapper.readTree(response);
            // response structure দেখে parse করবো
            String reply = json.get("response") != null
                    ? json.get("response").asText()
                    : json.get("message") != null
                    ? json.get("message").asText()
                    : json.toString();
            return new ResQBotResponse(reply, "freellm");
        } catch (Exception e) {
            throw new RuntimeException("FreeLLM parse error: " + e.getMessage());
        }
    }
}