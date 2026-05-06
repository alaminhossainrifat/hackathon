package com.pu_deltaforce.resqnet_backend.repository;

import com.pu_deltaforce.resqnet_backend.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findByAvailableTrue();
    List<Doctor> findByAreaAndAvailableTrue(String area);
    // List<Doctor> findBySpecializationAndAvailableTrue(String specialization);
    @Query("SELECT d FROM Doctor d WHERE LOWER(d.specialization) LIKE LOWER(CONCAT('%', :specialization, '%')) AND d.available = true")
    List<Doctor> findBySpecializationContaining(@Param("specialization") String specialization);
}