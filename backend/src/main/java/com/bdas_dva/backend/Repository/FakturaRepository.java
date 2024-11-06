package com.bdas_dva.backend.Repository;

import com.bdas_dva.backend.Model.Faktura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FakturaRepository extends JpaRepository<Faktura, Long> {
    // Дополнительные методы при необходимости
}
