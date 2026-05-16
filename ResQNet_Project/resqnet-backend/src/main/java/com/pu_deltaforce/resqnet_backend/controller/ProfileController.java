package com.pu_deltaforce.resqnet_backend.controller;

import com.pu_deltaforce.resqnet_backend.model.SosAlert;
import com.pu_deltaforce.resqnet_backend.model.User;
import com.pu_deltaforce.resqnet_backend.model.UserProfile;
import com.pu_deltaforce.resqnet_backend.repository.SosAlertRepository;
import com.pu_deltaforce.resqnet_backend.repository.UserProfileRepository;
import com.pu_deltaforce.resqnet_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ProfileController {

    private final UserProfileRepository profileRepository;
    private final SosAlertRepository sosRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<UserProfile> getProfile() {
        User currentUser = getAuthenticatedUser(); // Method Call

        return profileRepository.findById(currentUser.getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @PutMapping
    public ResponseEntity<UserProfile> updateProfile(@RequestBody UserProfile updatedProfile) {
        User currentUser = getAuthenticatedUser();

        // Set profile ID according to the user ID
        updatedProfile.setId(currentUser.getId());

        UserProfile savedProfile = profileRepository.save(updatedProfile);
        return ResponseEntity.ok(savedProfile);
    }

    @GetMapping("/history")
    public ResponseEntity<List<SosAlert>> getUserHistory() {
        User currentUser = getAuthenticatedUser();

        // Find User History
        List<SosAlert> history = sosRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
        return ResponseEntity.ok(history);
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }
}