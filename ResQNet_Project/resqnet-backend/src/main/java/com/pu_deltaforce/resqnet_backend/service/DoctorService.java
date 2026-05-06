package com.pu_deltaforce.resqnet_backend.service;


import com.pu_deltaforce.resqnet_backend.dto.DoctorRequest;
import com.pu_deltaforce.resqnet_backend.model.Doctor;
import com.pu_deltaforce.resqnet_backend.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository repository;

    public Doctor addDoctor(DoctorRequest request) {
        Doctor doctor = new Doctor();
        doctor.setName(request.getName());
        doctor.setSpecialization(request.getSpecialization());
        doctor.setPhone(request.getPhone());
        doctor.setHospital(request.getHospital());
        doctor.setArea(request.getArea());
        doctor.setConsultType(request.getConsultType());
        return repository.save(doctor);
    }

    public List<Doctor> getAllAvailable() {
        return repository.findByAvailableTrue();
    }

    public List<Doctor> getByArea(String area) {
        return repository.findByAreaAndAvailableTrue(area);
    }

    public List<Doctor> getBySpecialization(String specialization) {
//        return repository.findBySpecializationAndAvailableTrue(specialization);
        return repository.findBySpecializationContaining(specialization);
    }

    public Doctor toggleAvailability(Long id) {
        Doctor doctor = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found!"));
        doctor.setAvailable(!doctor.isAvailable());
        return repository.save(doctor);
    }
}