package com.bdas_dva.backend.Service;

import com.bdas_dva.backend.Model.Dodavatel;
import com.bdas_dva.backend.Repository.DodavatelRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DodavatelService {

    private final DodavatelRepository dodavatelRepository;

    public DodavatelService(DodavatelRepository dodavatelRepository) {
        this.dodavatelRepository = dodavatelRepository;
    }

    public List<Dodavatel> getAllDodavatele() {
        return dodavatelRepository.findAll();
    }
}
