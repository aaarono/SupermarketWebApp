package com.bdas_dva.backend.Repository;

import com.bdas_dva.backend.Model.Objednavka;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ObjednavkaRepository extends JpaRepository<Objednavka, Long> {
    // Дополнительные методы при необходимости
}
