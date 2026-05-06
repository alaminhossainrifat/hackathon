package com.pu_deltaforce.resqnet_backend.service;

import com.pu_deltaforce.resqnet_backend.dto.AmbulanceRequest;
import com.pu_deltaforce.resqnet_backend.model.Ambulance;
import com.pu_deltaforce.resqnet_backend.repository.AmbulanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AmbulanceService {

    private final AmbulanceRepository repository;

    public Ambulance addAmbulance(AmbulanceRequest request) {
        Ambulance ambulance = new Ambulance();
        ambulance.setVehicleNumber(request.getVehicleNumber());
        ambulance.setDriverName(request.getDriverName());
        ambulance.setDriverPhone(request.getDriverPhone());
        ambulance.setArea(request.getArea());
        ambulance.setCurrentLatitude(request.getCurrentLatitude());
        ambulance.setCurrentLongitude(request.getCurrentLongitude());
        return repository.save(ambulance);
    }

    public List<Ambulance> getAvailable() {
        return repository.findByStatus(Ambulance.AmbulanceStatus.AVAILABLE);
    }

    public List<Ambulance> getAvailableByArea(String area) {
        return repository.findByAreaAndStatus(area, Ambulance.AmbulanceStatus.AVAILABLE);
    }

    public Ambulance updateStatus(Long id, Ambulance.AmbulanceStatus status) {
        Ambulance ambulance = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ambulance not found!"));
        ambulance.setStatus(status);
        return repository.save(ambulance);
    }

    public Ambulance updateLocation(Long id, Double lat, Double lng) {
        Ambulance ambulance = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ambulance not found!"));
        ambulance.setCurrentLatitude(lat);
        ambulance.setCurrentLongitude(lng);
        return repository.save(ambulance);
    }
}