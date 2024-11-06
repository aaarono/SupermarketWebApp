package com.bdas_dva.backend.Repository;

import com.bdas_dva.backend.Model.KategorieProduktu;
import com.bdas_dva.backend.Model.Produkt;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProduktRepository extends JpaRepository<Produkt, Long> {
    // Получить ограниченное количество продуктов после определенного ID
    @Query("SELECT p FROM Produkt p WHERE p.idProduktu > :id ORDER BY p.idProduktu ASC")
    List<Produkt> findTopNProduktsAfterId(Long id, Pageable pageable);

    // Получить ограниченное количество продуктов по категории после определенного ID
    @Query("SELECT p FROM Produkt p WHERE p.idProduktu > :id AND p.kategorieProduktu = :kategorieProduktu ORDER BY p.idProduktu ASC")
    List<Produkt> findTopNProduktsByKategorieAfterId(Long id, KategorieProduktu kategorieProduktu, Pageable pageable);

    // Получить все продукты по категории с ограничением
    @Query("SELECT p FROM Produkt p WHERE p.kategorieProduktu = :kategorieProduktu ORDER BY p.idProduktu ASC")
    List<Produkt> findAllProduktsByKategorieWithLimit(KategorieProduktu kategorieProduktu, Pageable pageable);
}
