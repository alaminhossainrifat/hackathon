package com.pu_deltaforce.resqnet_backend.repository;

import aj.org.objectweb.asm.commons.Remapper;
import com.pu_deltaforce.resqnet_backend.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    // Custom method to find a user profile by their associated user ID
    Optional<UserProfile> findByUserId(Long userId);
}