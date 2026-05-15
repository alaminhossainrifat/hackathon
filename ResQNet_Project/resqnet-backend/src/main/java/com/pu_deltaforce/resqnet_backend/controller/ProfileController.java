package com.pu_deltaforce.resqnet_backend.controller;

import com.pu_deltaforce.resqnet_backend.model.UserProfile;
import com.pu_deltaforce.resqnet_backend.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class ProfileController {

    @Autowired
    private UserProfileRepository profileRepository;

    @GetMapping
    public ResponseEntity<UserProfile> getProfile() {
        // If there is a profile in the database, it will send, if not, it will send No Content without saving anything
        return profileRepository.findById(1L)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @PutMapping
    public ResponseEntity<UserProfile> updateProfile(@RequestBody UserProfile updatedProfile) {
        // Check if profile ID 1 already exists
        UserProfile existingProfile = profileRepository.findById(1L).orElse(null);

        if (existingProfile == null) {
            // First time saving: Let PostgreSQL generate the ID automatically
            updatedProfile.setId(null);
        } else {
            // Updating existing profile: Force ID to 1
            updatedProfile.setId(1L);
        }

        UserProfile savedProfile = profileRepository.save(updatedProfile);
        return ResponseEntity.ok(savedProfile);
    }
}