package com.pu_deltaforce.resqnet_backend.service;


import com.pu_deltaforce.resqnet_backend.dto.DisasterAlertRequest;
import com.pu_deltaforce.resqnet_backend.model.DisasterAlert;
import com.pu_deltaforce.resqnet_backend.repository.DisasterAlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DisasterAlertService {

    private final DisasterAlertRepository repository;

    public DisasterAlert createAlert(DisasterAlertRequest request) {
        DisasterAlert alert = new DisasterAlert();
        alert.setTitle(request.getTitle());
        alert.setDescription(request.getDescription());
        alert.setAlertType(request.getAlertType());
        alert.setSeverity(request.getSeverity());
        alert.setLocation(request.getLocation());
        alert.setLatitude(request.getLatitude());
        alert.setLongitude(request.getLongitude());
        return repository.save(alert);
    }

    public List<DisasterAlert> getAllActiveAlerts() {
        return repository.findByActiveTrue();
    }

    public DisasterAlert deactivateAlert(Long id) {
        DisasterAlert alert = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found!"));
        alert.setActive(false);
        return repository.save(alert);
    }

    public DisasterAlert activateAlert(Long id) {
        DisasterAlert alert = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found!"));
        alert.setActive(true);
        return repository.save(alert);
    }
}
