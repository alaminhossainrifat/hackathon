package com.pu_deltaforce.resqnet_backend.controller;

import com.pu_deltaforce.resqnet_backend.dto.BloodBankRequest;
import com.pu_deltaforce.resqnet_backend.model.BloodBank;
import com.pu_deltaforce.resqnet_backend.service.BloodBankService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blood-bank")
@RequiredArgsConstructor
public class BloodBankController {

    private final BloodBankService service;

    @PostMapping
    public ResponseEntity<BloodBank> addDonor(@RequestBody BloodBankRequest request) {
        return ResponseEntity.ok(service.addDonor(request));
    }

    @GetMapping("/{bloodGroup}")
    public ResponseEntity<List<BloodBank>> findByBloodGroup(
            @PathVariable BloodBank.BloodGroup bloodGroup) {
        return ResponseEntity.ok(service.findByBloodGroup(bloodGroup));
    }

    @GetMapping("/{bloodGroup}/{area}")
    public ResponseEntity<List<BloodBank>> findByBloodGroupAndArea(
            @PathVariable BloodBank.BloodGroup bloodGroup,
            @PathVariable String area) {
        return ResponseEntity.ok(service.findByBloodGroupAndArea(bloodGroup, area));
    }

    @PutMapping("/{id}/toggle-availability")
    public ResponseEntity<BloodBank> toggleAvailability(@PathVariable Long id) {
        return ResponseEntity.ok(service.toggleAvailability(id));
    }
}
