package com.bdas_dva.backend.Repository;

import com.bdas_dva.backend.Model.Hotovost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HotovostRepository extends JpaRepository<Hotovost, Long> {
    // Дополнительные методы при необходимости
}
