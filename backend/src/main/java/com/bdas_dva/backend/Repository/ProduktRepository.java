package com.bdas_dva.backend.Repository;

import com.bdas_dva.backend.Model.Produkt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProduktRepository extends JpaRepository<Produkt, Long> {
    // Дополнительные методы при необходимости
}
