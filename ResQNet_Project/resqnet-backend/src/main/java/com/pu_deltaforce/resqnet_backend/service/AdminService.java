package com.pu_deltaforce.resqnet_backend.service;

import com.pu_deltaforce.resqnet_backend.dto.AdminMetricsDTO;
import com.pu_deltaforce.resqnet_backend.dto.UserDTO;
import com.pu_deltaforce.resqnet_backend.model.SosAlert;
import com.pu_deltaforce.resqnet_backend.model.User;
import com.pu_deltaforce.resqnet_backend.repository.SafeZoneRepository;
import com.pu_deltaforce.resqnet_backend.repository.SosAlertRepository;
import com.pu_deltaforce.resqnet_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final SosAlertRepository sosAlertRepository;
    private final SafeZoneRepository safeZoneRepository;

    public AdminMetricsDTO getDashboardMetrics() {
        AdminMetricsDTO metrics = new AdminMetricsDTO();

        metrics.setTotalUsers(userRepository.count());
//        metrics.setTotalVolunteers(userRepository.countByRole(User.Role.VOLUNTEER));
//        metrics.setTotalVolunteers(userRepository.countByRole(User.Role.DOCTOR));
        metrics.setTotalVolunteers(userRepository.countVolunteers());
        metrics.setTotalActiveSos(sosAlertRepository.countByStatus(SosAlert.SosStatus.ACTIVE));
        metrics.setTotalActiveSafeZones(safeZoneRepository.countByAvailableTrue());

        return metrics;
    }
// --- User Management ---

    // 1. Get the list of all users
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // 2. Update the role of a user
    public UserDTO updateUserRole(Long userId, User.Role newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        user.setRole(newRole);
        User updatedUser = userRepository.save(user);

        return mapToDTO(updatedUser);
    }

    // Helper Method: Convert User entity to UserDTO
    private UserDTO mapToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole());
        return dto;
    }

    // --- SOS Command Center ---

    // 1. Fetch all SOS alerts (newest alerts first)
    public List<SosAlert> getAllSosAlerts() {
        return sosAlertRepository.findAll(
                org.springframework.data.domain.Sort.by(
                        org.springframework.data.domain.Sort.Direction.DESC,
                        "createdAt"
                )
        );
    }

    // 2. Update the status of a specific SOS alert (from ACTIVE to RESOLVED)
    public SosAlert updateSosStatus(Long sosId, SosAlert.SosStatus newStatus) {
        SosAlert alert = sosAlertRepository.findById(sosId)
                .orElseThrow(() -> new RuntimeException("SOS Alert not found with id: " + sosId));

        alert.setStatus(newStatus);
        return sosAlertRepository.save(alert);
    }
}