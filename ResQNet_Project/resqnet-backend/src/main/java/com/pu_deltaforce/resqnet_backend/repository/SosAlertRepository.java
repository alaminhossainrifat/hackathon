package com.pu_deltaforce.resqnet_backend.repository;

import com.pu_deltaforce.resqnet_backend.model.SosAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SosAlertRepository extends JpaRepository<SosAlert, Long> {
    List<SosAlert> findByStatus(SosAlert.SosStatus status);
    List<SosAlert> findBySenderPhone(String senderPhone);
}