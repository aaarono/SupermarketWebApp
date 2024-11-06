package com.bdas_dva.backend.Repository;

import com.bdas_dva.backend.Model.ProduktDodavatel;
import com.bdas_dva.backend.Model.ProduktDodavatelId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProduktDodavatelRepository extends JpaRepository<ProduktDodavatel, ProduktDodavatelId> {
    // Дополнительные методы при необходимости
}
