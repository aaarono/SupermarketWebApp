package com.bdas_dva.backend.Repository;

import com.bdas_dva.backend.Model.Zamestnanec;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ZamestnanecRepository extends JpaRepository<Zamestnanec, Long> {
    // Дополнительные методы при необходимости
}
