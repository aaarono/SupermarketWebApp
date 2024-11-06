package com.bdas_dva.backend.Repository;

import com.bdas_dva.backend.Model.HistorieObjednavek;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HistorieObjednavekRepository extends JpaRepository<HistorieObjednavek, Long> {
    // Дополнительные методы при необходимости
}
