package com.pu_deltaforce.resqnet_backend.repository;

import com.pu_deltaforce.resqnet_backend.model.MissingPerson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MissingPersonRepository extends JpaRepository<MissingPerson, Long> {
    List<MissingPerson> findByStatus(MissingPerson.Status status);

    @Query("SELECT m FROM MissingPerson m WHERE LOWER(m.name) LIKE LOWER(CONCAT('%', :name, '%')) AND m.status = 'MISSING'")
    List<MissingPerson> searchByName(@Param("name") String name);

    @Query("SELECT m FROM MissingPerson m WHERE LOWER(m.lastSeenLocation) LIKE LOWER(CONCAT('%', :location, '%')) AND m.status = 'MISSING'")
    List<MissingPerson> searchByLocation(@Param("location") String location);
}