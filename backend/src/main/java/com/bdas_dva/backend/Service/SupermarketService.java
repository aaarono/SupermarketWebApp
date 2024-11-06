package com.bdas_dva.backend.Service;

import com.bdas_dva.backend.Exception.ResourceNotFoundException;
import com.bdas_dva.backend.Model.Supermarket;
import com.bdas_dva.backend.Repository.SupermarketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupermarketService implements ISupermarketService {

    @Autowired
    private SupermarketRepository supermarketRepository;

    @Override
    public Supermarket createSupermarket(Supermarket supermarket) {
        return supermarketRepository.save(supermarket);
    }

    @Override
    public Supermarket getSupermarketById(Long id) {
        return supermarketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supermarket", "id", id));
    }

    @Override
    public List<Supermarket> getAllSupermarkets() {
        return supermarketRepository.findAll();
    }

    @Override
    public Supermarket updateSupermarket(Long id, Supermarket supermarketDetails) {
        Supermarket supermarket = getSupermarketById(id);
        supermarket.setNazev(supermarketDetails.getNazev());
        supermarket.setTelefon(supermarketDetails.getTelefon());
        supermarket.setEmail(supermarketDetails.getEmail());
        return supermarketRepository.save(supermarket);
    }

    @Override
    public void deleteSupermarket(Long id) {
        Supermarket supermarket = getSupermarketById(id);
        supermarketRepository.delete(supermarket);
    }
}
