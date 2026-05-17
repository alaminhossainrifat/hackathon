package com.pu_deltaforce.resqnet_backend.repository;

import com.pu_deltaforce.resqnet_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    // Count users by their specific role
//    long countByRole(User.Role role);
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = 'VOLUNTEER'")
    long countVolunteers();

    // Count total registered users
    long count();
}