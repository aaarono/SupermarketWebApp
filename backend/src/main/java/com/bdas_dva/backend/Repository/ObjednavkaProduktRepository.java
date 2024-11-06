package com.bdas_dva.backend.Repository;

import com.bdas_dva.backend.Model.ObjednavkaProdukt;
import com.bdas_dva.backend.Model.ObjednavkaProduktId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ObjednavkaProduktRepository extends JpaRepository<ObjednavkaProdukt, ObjednavkaProduktId> {
    // Дополнительные методы при необходимости
}
