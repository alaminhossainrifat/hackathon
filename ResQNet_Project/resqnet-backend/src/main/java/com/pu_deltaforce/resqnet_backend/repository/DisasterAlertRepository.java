package com.pu_deltaforce.resqnet_backend.repository;

import com.pu_deltaforce.resqnet_backend.model.DisasterAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisasterAlertRepository extends JpaRepository<DisasterAlert, Long> {
    List<DisasterAlert> findByActiveTrue();
    List<DisasterAlert> findByAlertTypeAndActiveTrue(DisasterAlert.AlertType alertType);
}
