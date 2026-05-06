package com.pu_deltaforce.resqnet_backend.service;


import com.pu_deltaforce.resqnet_backend.model.DisasterAlert;
import com.pu_deltaforce.resqnet_backend.model.SosAlert;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    // Disaster alert broadcast
    public void broadcastDisasterAlert(DisasterAlert alert) {
        messagingTemplate.convertAndSend("/topic/disasters", alert);
    }

    // SOS alert broadcast
    public void broadcastSosAlert(SosAlert sos) {
        messagingTemplate.convertAndSend("/topic/sos", sos);
    }
}