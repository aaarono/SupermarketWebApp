package com.bdas_dva.backend.Service;

import com.bdas_dva.backend.Exception.ResourceNotFoundException;
import com.bdas_dva.backend.Model.KategorieProduktu;
import com.bdas_dva.backend.Model.Produkt;
import com.bdas_dva.backend.Repository.KategorieProduktuRepository;
import com.bdas_dva.backend.Repository.ProduktRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProduktService implements IProduktService {

    @Autowired
    private ProduktRepository produktRepository;

    @Autowired
    private KategorieProduktuRepository kategorieProduktuRepository;

    @Override
    public Produkt createProdukt(Produkt produkt) {
        return produktRepository.save(produkt);
    }

    @Override
    public Produkt getProduktById(Long id) {
        return produktRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produkt", "id", id));
    }

    @Override
    public List<Produkt> getAllProdukts() {
        return produktRepository.findAll();
    }

    @Override
    public Produkt updateProdukt(Long id, Produkt produktDetails) {
        Produkt produkt = getProduktById(id);
        produkt.setNazev(produktDetails.getNazev());
        produkt.setCena(produktDetails.getCena());
        produkt.setPopis(produktDetails.getPopis());
        return produktRepository.save(produkt);
    }

    @Override
    public void deleteProdukt(Long id) {
        Produkt produkt = getProduktById(id);
        produktRepository.delete(produkt);
    }

    @Override
    public List<Produkt> getNumOfProduktsAfterId(Long id, Long num) {
        return produktRepository.findTopNProduktsAfterId(id, PageRequest.of(0, num.intValue()));
    }

    @Override
    public List<Produkt> getNumOfPodleKategorieProduktsAfterId(Long id, Long num, KategorieProduktu kategorieProduktu) {
        return produktRepository.findTopNProduktsByKategorieAfterId(id, kategorieProduktu, PageRequest.of(0, num.intValue()));
    }

    @Override
    public List<Produkt> getAllPodleKategorieProdukts(Long id, Long num, KategorieProduktu kategorieProduktu) {
        return produktRepository.findAllProduktsByKategorieWithLimit(kategorieProduktu, PageRequest.of(0, num.intValue()));
    }
}
