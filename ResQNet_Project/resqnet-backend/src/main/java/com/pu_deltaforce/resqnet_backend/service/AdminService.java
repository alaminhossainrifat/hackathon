package com.pu_deltaforce.resqnet_backend.service;

import com.pu_deltaforce.resqnet_backend.dto.AdminMetricsDTO;
import com.pu_deltaforce.resqnet_backend.model.SosAlert;
import com.pu_deltaforce.resqnet_backend.model.User;
import com.pu_deltaforce.resqnet_backend.repository.SafeZoneRepository;
import com.pu_deltaforce.resqnet_backend.repository.SosAlertRepository;
import com.pu_deltaforce.resqnet_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final SosAlertRepository sosAlertRepository;
    private final SafeZoneRepository safeZoneRepository;

    public AdminMetricsDTO getDashboardMetrics() {
        AdminMetricsDTO metrics = new AdminMetricsDTO();

        metrics.setTotalUsers(userRepository.count());
        metrics.setTotalVolunteers(userRepository.countByRole(User.Role.VOLUNTEER));
        metrics.setTotalVolunteers(userRepository.countByRole(User.Role.DOCTOR));
        metrics.setTotalActiveSos(sosAlertRepository.countByStatus(SosAlert.SosStatus.ACTIVE));
        metrics.setTotalActiveSafeZones(safeZoneRepository.countByAvailableTrue());

        return metrics;
    }
}