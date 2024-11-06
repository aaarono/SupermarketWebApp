package com.bdas_dva.backend.Repository;

import com.bdas_dva.backend.Model.Platba;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlatbaRepository extends JpaRepository<Platba, Long> {
    // Дополнительные методы при необходимости
}
