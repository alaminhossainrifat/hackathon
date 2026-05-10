package com.pu_deltaforce.resqnet_backend.controller;

import com.pu_deltaforce.resqnet_backend.dto.ResQBotRequest;
import com.pu_deltaforce.resqnet_backend.dto.ResQBotResponse;
import com.pu_deltaforce.resqnet_backend.service.ResQBotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/resqbot")
@RequiredArgsConstructor
public class ResQBotController {

    private final ResQBotService resQBotService;

    @PostMapping("/chat")
    public ResponseEntity<ResQBotResponse> chat(@RequestBody ResQBotRequest request) {
        ResQBotResponse response = resQBotService.chat(request);
        return ResponseEntity.ok(response);
    }
}