package com.bdas_dva.backend.Service;

import com.bdas_dva.backend.Model.Dodavatele;
import com.bdas_dva.backend.Repository.DodavatelRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DodavatelService {

    private final DodavatelRepository dodavatelRepository;

    public DodavatelService(DodavatelRepository dodavatelRepository) {
        this.dodavatelRepository = dodavatelRepository;
    }

    public List<Dodavatele> getAllDodavatele() {
        return dodavatelRepository.findAll();
    }
}
