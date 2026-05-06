package com.pu_deltaforce.resqnet_backend.repository;

import com.pu_deltaforce.resqnet_backend.model.CivicReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CivicReportRepository extends JpaRepository<CivicReport, Long> {
    List<CivicReport> findByStatus(CivicReport.ReportStatus status);
    List<CivicReport> findByReportType(CivicReport.ReportType reportType);

    @Query("SELECT c FROM CivicReport c WHERE LOWER(c.location) LIKE LOWER(CONCAT('%', :location, '%'))")
    List<CivicReport> searchByLocation(@Param("location") String location);
}