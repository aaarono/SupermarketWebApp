package com.bdas_dva.backend.Service;

import com.bdas_dva.backend.Exception.ResourceNotFoundException;
import com.bdas_dva.backend.Model.Sklad;
import com.bdas_dva.backend.Repository.SkladRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkladService implements ISkladService {

    @Autowired
    private SkladRepository skladRepository;

    @Override
    public Sklad createSklad(Sklad sklad) {
        return skladRepository.save(sklad);
    }

    @Override
    public Sklad getSkladById(Long id) {
        return skladRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sklad", "id", id));
    }

    @Override
    public List<Sklad> getAllSklads() {
        return skladRepository.findAll();
    }

    @Override
    public Sklad updateSklad(Long id, Sklad skladDetails) {
        Sklad sklad = getSkladById(id);
        sklad.setNazev(skladDetails.getNazev());
        sklad.setTelefon(skladDetails.getTelefon());
        sklad.setEmail(skladDetails.getEmail());
        return skladRepository.save(sklad);
    }

    @Override
    public void deleteSklad(Long id) {
        Sklad sklad = getSkladById(id);
        skladRepository.delete(sklad);
    }
}
