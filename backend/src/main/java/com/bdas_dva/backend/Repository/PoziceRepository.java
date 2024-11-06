package com.bdas_dva.backend.Repository;

import com.bdas_dva.backend.Model.Pozice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PoziceRepository extends JpaRepository<Pozice, Long> {
    // Дополнительные методы при необходимости
}
