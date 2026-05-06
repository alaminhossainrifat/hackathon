package com.pu_deltaforce.resqnet_backend.service;

import com.pu_deltaforce.resqnet_backend.dto.MissingPersonRequest;
import com.pu_deltaforce.resqnet_backend.model.MissingPerson;
import com.pu_deltaforce.resqnet_backend.repository.MissingPersonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MissingPersonService {

    private final MissingPersonRepository repository;

    public MissingPerson report(MissingPersonRequest request) {
        MissingPerson person = new MissingPerson();
        person.setName(request.getName());
        person.setAge(request.getAge());
        person.setGender(request.getGender());
        person.setLastSeenLocation(request.getLastSeenLocation());
        person.setDescription(request.getDescription());
        person.setReporterName(request.getReporterName());
        person.setReporterPhone(request.getReporterPhone());
        return repository.save(person);
    }

    public List<MissingPerson> getAllMissing() {
        return repository.findByStatus(MissingPerson.Status.MISSING);
    }

    public List<MissingPerson> searchByName(String name) {
        return repository.searchByName(name);
    }

    public List<MissingPerson> searchByLocation(String location) {
        return repository.searchByLocation(location);
    }

    public MissingPerson markAsFound(Long id) {
        MissingPerson person = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Missing person record not found!"));
        person.setStatus(MissingPerson.Status.FOUND);
        return repository.save(person);
    }
}
