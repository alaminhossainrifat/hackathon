package com.pu_deltaforce.resqnet_backend.repository;

import com.pu_deltaforce.resqnet_backend.model.SafeZone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SafeZoneRepository extends JpaRepository<SafeZone, Long> {
    List<SafeZone> findByAvailableTrue();
    List<SafeZone> findByZoneTypeAndAvailableTrue(SafeZone.ZoneType zoneType);

    // Count total active/available safe zones
    long countByAvailableTrue();
}
