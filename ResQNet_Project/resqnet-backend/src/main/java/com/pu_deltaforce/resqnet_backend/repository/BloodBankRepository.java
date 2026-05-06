package com.pu_deltaforce.resqnet_backend.repository;

import com.pu_deltaforce.resqnet_backend.model.BloodBank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BloodBankRepository extends JpaRepository<BloodBank, Long> {
    List<BloodBank> findByBloodGroupAndAvailableTrue(BloodBank.BloodGroup bloodGroup);
    List<BloodBank> findByBloodGroupAndAreaAndAvailableTrue(BloodBank.BloodGroup bloodGroup, String area);
}