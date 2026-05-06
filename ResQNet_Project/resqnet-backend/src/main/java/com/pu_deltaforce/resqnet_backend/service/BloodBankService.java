package com.pu_deltaforce.resqnet_backend.service;


import com.pu_deltaforce.resqnet_backend.dto.BloodBankRequest;
import com.pu_deltaforce.resqnet_backend.model.BloodBank;
import com.pu_deltaforce.resqnet_backend.repository.BloodBankRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BloodBankService {

    private final BloodBankRepository repository;

    public BloodBank addDonor(BloodBankRequest request) {
        BloodBank donor = new BloodBank();
        donor.setDonorName(request.getDonorName());
        donor.setPhone(request.getPhone());
        donor.setArea(request.getArea());
        donor.setBloodGroup(request.getBloodGroup());
        return repository.save(donor);
    }

    public List<BloodBank> findByBloodGroup(BloodBank.BloodGroup bloodGroup) {
        return repository.findByBloodGroupAndAvailableTrue(bloodGroup);
    }

    public List<BloodBank> findByBloodGroupAndArea(BloodBank.BloodGroup bloodGroup, String area) {
        return repository.findByBloodGroupAndAreaAndAvailableTrue(bloodGroup, area);
    }

    public BloodBank toggleAvailability(Long id) {
        BloodBank donor = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donor not found!"));
        donor.setAvailable(!donor.isAvailable());
        return repository.save(donor);
    }
}
