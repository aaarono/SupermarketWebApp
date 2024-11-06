package com.bdas_dva.backend.Service;

import com.bdas_dva.backend.Model.KategorieProduktu;
import com.bdas_dva.backend.Model.Produkt;
import java.util.List;

public interface IProduktService {
    Produkt createProdukt(Produkt produkt);
    Produkt getProduktById(Long id);
    List<Produkt> getAllProdukts();
    Produkt updateProdukt(Long id, Produkt produktDetails);
    void deleteProdukt(Long id);
    List<Produkt> getNumOfProduktsAfterId(Long id, Long num);
    List<Produkt> getNumOfPodleKategorieProduktsAfterId(Long id, Long num, KategorieProduktu kategorieProduktu);
    List<Produkt> getAllPodleKategorieProdukts(Long id, Long num, KategorieProduktu kategorieProduktu);
}
