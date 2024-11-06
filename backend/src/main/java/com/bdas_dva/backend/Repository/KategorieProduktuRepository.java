package com.bdas_dva.backend.Repository;

import com.bdas_dva.backend.Model.KategorieProduktu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KategorieProduktuRepository extends JpaRepository<KategorieProduktu, Long> {
    // Дополнительные методы при необходимости
}
