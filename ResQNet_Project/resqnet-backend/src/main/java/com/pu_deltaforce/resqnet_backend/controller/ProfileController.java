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
        User currentUser = getAuthenticatedUser();

        // Using findByUserId instead of findById to fetch the specific user's profile
        return profileRepository.findByUserId(currentUser.getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @PutMapping
    public ResponseEntity<UserProfile> updateProfile(@RequestBody UserProfile updatedProfile) {
        User currentUser = getAuthenticatedUser();

        // Check if a profile already exists for this authenticated user
        UserProfile existingProfile = profileRepository.findByUserId(currentUser.getId()).orElse(null);

        if (existingProfile == null) {
            // For a new profile, set ID to null so the database generates it automatically
            updatedProfile.setId(null);
        } else {
            // For an existing profile, keep the original ID to update the same record
            updatedProfile.setId(existingProfile.getId());
        }

        // Link the logged-in user's ID to the profile's 'userId' field
        updatedProfile.setUserId(currentUser.getId());

        UserProfile savedProfile = profileRepository.save(updatedProfile);
        return ResponseEntity.ok(savedProfile);
    }

    @GetMapping("/history")
    public ResponseEntity<List<SosAlert>> getUserHistory() {
        User currentUser = getAuthenticatedUser();

        // Fetch SOS history specific to the authenticated user
        List<SosAlert> history = sosRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
        return ResponseEntity.ok(history);
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }
}