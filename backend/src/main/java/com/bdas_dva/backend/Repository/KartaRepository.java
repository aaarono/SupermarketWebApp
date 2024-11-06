package com.bdas_dva.backend.Repository;

import com.bdas_dva.backend.Model.Karta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KartaRepository extends JpaRepository<Karta, Long> {
    // Дополнительные методы при необходимости
}
