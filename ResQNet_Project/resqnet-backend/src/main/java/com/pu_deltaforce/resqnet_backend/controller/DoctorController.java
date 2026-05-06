package com.pu_deltaforce.resqnet_backend.controller;

import com.pu_deltaforce.resqnet_backend.dto.DoctorRequest;
import com.pu_deltaforce.resqnet_backend.model.Doctor;
import com.pu_deltaforce.resqnet_backend.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService service;

    @PostMapping
    public ResponseEntity<Doctor> addDoctor(@RequestBody DoctorRequest request) {
        return ResponseEntity.ok(service.addDoctor(request));
    }

    @GetMapping
    public ResponseEntity<List<Doctor>> getAll() {
        return ResponseEntity.ok(service.getAllAvailable());
    }

    @GetMapping("/area/{area}")
    public ResponseEntity<List<Doctor>> getByArea(@PathVariable String area) {
        return ResponseEntity.ok(service.getByArea(area));
    }

    @GetMapping("/specialization/{specialization}")
    public ResponseEntity<List<Doctor>> getBySpecialization(@PathVariable String specialization) {
        return ResponseEntity.ok(service.getBySpecialization(specialization));
    }

    @PutMapping("/{id}/toggle-availability")
    public ResponseEntity<Doctor> toggleAvailability(@PathVariable Long id) {
        return ResponseEntity.ok(service.toggleAvailability(id));
    }
}