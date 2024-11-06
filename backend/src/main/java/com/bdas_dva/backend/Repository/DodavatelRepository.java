package com.bdas_dva.backend.Repository;

import com.bdas_dva.backend.Model.Dodavatele;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DodavatelRepository extends JpaRepository<Dodavatele, Long> {
}
