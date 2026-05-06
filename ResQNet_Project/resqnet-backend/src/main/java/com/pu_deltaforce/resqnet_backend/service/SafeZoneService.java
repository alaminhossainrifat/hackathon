package com.pu_deltaforce.resqnet_backend.service;

import com.pu_deltaforce.resqnet_backend.dto.SafeZoneRequest;
import com.pu_deltaforce.resqnet_backend.model.SafeZone;
import com.pu_deltaforce.resqnet_backend.repository.SafeZoneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SafeZoneService {

    private final SafeZoneRepository repository;

    public SafeZone createSafeZone(SafeZoneRequest request) {
        SafeZone zone = new SafeZone();
        zone.setName(request.getName());
        zone.setAddress(request.getAddress());
        zone.setLatitude(request.getLatitude());
        zone.setLongitude(request.getLongitude());
        zone.setZoneType(request.getZoneType());
        zone.setCapacity(request.getCapacity());
        return repository.save(zone);
    }

    public List<SafeZone> getAllAvailable() {
        return repository.findByAvailableTrue();
    }

    public SafeZone updateOccupancy(Long id, Integer occupancy) {
        SafeZone zone = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Safe Zone not found!"));

        if (occupancy > zone.getCapacity()) {
            throw new RuntimeException("Occupancy cannot exceed capacity of " + zone.getCapacity() + "!");
        }

        zone.setCurrentOccupancy(occupancy);
        zone.setAvailable(occupancy < zone.getCapacity());
        return repository.save(zone);
    }

    public SafeZone toggleAvailability(Long id) {
        SafeZone zone = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Safe Zone not found!"));
        zone.setAvailable(!zone.isAvailable());
        return repository.save(zone);
    }

    public List<SafeZone> getByType(SafeZone.ZoneType zoneType) {
        return repository.findByZoneTypeAndAvailableTrue(zoneType);
    }
}
