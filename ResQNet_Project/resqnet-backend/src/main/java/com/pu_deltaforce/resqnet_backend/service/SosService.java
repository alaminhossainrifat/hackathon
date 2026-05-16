package com.pu_deltaforce.resqnet_backend.service;

import com.pu_deltaforce.resqnet_backend.dto.SosRequest;
import com.pu_deltaforce.resqnet_backend.dto.SosResponse;
import com.pu_deltaforce.resqnet_backend.model.Ambulance;
import com.pu_deltaforce.resqnet_backend.model.SafeZone;
import com.pu_deltaforce.resqnet_backend.model.SosAlert;
import com.pu_deltaforce.resqnet_backend.model.User;
import com.pu_deltaforce.resqnet_backend.repository.AmbulanceRepository;
import com.pu_deltaforce.resqnet_backend.repository.SafeZoneRepository;
import com.pu_deltaforce.resqnet_backend.repository.SosAlertRepository;
import com.pu_deltaforce.resqnet_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SosService {

    private final SosAlertRepository sosRepository;
    private final AmbulanceRepository ambulanceRepository;
    private final SafeZoneRepository safeZoneRepository;
    private final WebSocketService webSocketService;
    private final UserRepository userRepository; // Added for dynamic user search

    public SosResponse triggerSos(SosRequest request, String email) {

        // Finding users from database by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        // SOS save
        SosAlert sos = new SosAlert();
        sos.setUserId(user.getId()); // User's dynamic ID set.
        sos.setSenderName(request.getSenderName());
        sos.setSenderPhone(request.getSenderPhone());
        sos.setLatitude(request.getLatitude());
        sos.setLongitude(request.getLongitude());
        sos.setMessage(request.getMessage());
        SosAlert saved = sosRepository.save(sos);

        // WebSocket Broadcast
        if(webSocketService != null) {
            webSocketService.broadcastSosAlert(saved);
        }

        // Find the nearest ambulance
        List<Ambulance> ambulances = ambulanceRepository
                .findByStatus(Ambulance.AmbulanceStatus.AVAILABLE);
        Ambulance nearest = findNearestAmbulance(ambulances,
                request.getLatitude(), request.getLongitude());

        // Find the nearest safe zone
        List<SafeZone> safeZones = safeZoneRepository.findByAvailableTrue();
        SafeZone nearestZone = findNearestSafeZone(safeZones,
                request.getLatitude(), request.getLongitude());

        // Create Response
        SosResponse response = new SosResponse();
        response.setSosId(saved.getId());
        response.setMessage("SOS triggered! Help is on the way!");

        SosResponse.NearestInfo info = new SosResponse.NearestInfo();

        if (nearest != null) {
            info.setAmbulanceArea(nearest.getArea());
            info.setAmbulancePhone(nearest.getDriverPhone());
        }

        if (nearestZone != null) {
            info.setSafeZoneName(nearestZone.getName());
            info.setSafeZoneAddress(nearestZone.getAddress());
        }

        response.setNearest(info);
        return response;
    }

    public List<SosAlert> getActiveSos() {
        return sosRepository.findByStatus(SosAlert.SosStatus.ACTIVE);
    }

    public SosAlert resolvesSos(Long id) {
        SosAlert sos = sosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SOS not found!"));
        sos.setStatus(SosAlert.SosStatus.RESOLVED);
        return sosRepository.save(sos);
    }

    // Distance calculation (Haversine formula)
    private Ambulance findNearestAmbulance(List<Ambulance> list, Double lat, Double lng) {
        return list.stream()
                .filter(a -> a.getCurrentLatitude() != null && a.getCurrentLongitude() != null)
                .min((a, b) -> Double.compare(
                        distance(lat, lng, a.getCurrentLatitude(), a.getCurrentLongitude()),
                        distance(lat, lng, b.getCurrentLatitude(), b.getCurrentLongitude())
                )).orElse(list.isEmpty() ? null : list.get(0));
    }

    private SafeZone findNearestSafeZone(List<SafeZone> list, Double lat, Double lng) {
        return list.stream()
                .min((a, b) -> Double.compare(
                        distance(lat, lng, a.getLatitude(), a.getLongitude()),
                        distance(lat, lng, b.getLatitude(), b.getLongitude())
                )).orElse(null);
    }

    private double distance(double lat1, double lng1, double lat2, double lng2) {
        double R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
}