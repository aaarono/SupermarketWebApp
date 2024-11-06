package com.bdas_dva.backend.Controller;

import com.bdas_dva.backend.Exception.ResourceNotFoundException;
import com.bdas_dva.backend.Model.KategorieProduktu;
import com.bdas_dva.backend.Model.Produkt;
import com.bdas_dva.backend.Service.IProduktService;
import com.bdas_dva.backend.Repository.KategorieProduktuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/produkts")
@CrossOrigin(origins = "http://localhost:3000") // Замените на адрес вашего фронтенда
public class ProduktController {

    @Autowired
    private IProduktService produktService;

    @Autowired
    private KategorieProduktuRepository kategorieProduktuRepository;

    //TODO Добавить авторизацию для админов
    //@PreAuthorize("hasRole('Admin')")
    @PostMapping
    public ResponseEntity<Produkt> createProdukt(@RequestBody Produkt produkt) {
        Produkt createdProdukt = produktService.createProdukt(produkt);
        return ResponseEntity.ok(createdProdukt);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produkt> getProduktById(@PathVariable Long id) {
        Produkt produkt = produktService.getProduktById(id);
        return ResponseEntity.ok(produkt);
    }

    @GetMapping
    public ResponseEntity<List<Produkt>> getAllProdukts() {
        List<Produkt> produkts = produktService.getAllProdukts();
        return ResponseEntity.ok(produkts);
    }

    //TODO Добавить авторизацию для админов
    //@PreAuthorize("hasRole('Admin')")
    @PutMapping("/{id}")
    public ResponseEntity<Produkt> updateProdukt(@PathVariable Long id, @RequestBody Produkt produktDetails) {
        Produkt updatedProdukt = produktService.updateProdukt(id, produktDetails);
        return ResponseEntity.ok(updatedProdukt);
    }

    //TODO Добавить авторизацию для админов
    //@PreAuthorize("hasRole('Admin')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProdukt(@PathVariable Long id) {
        produktService.deleteProdukt(id);
        return ResponseEntity.ok().build();
    }

    // Получение ограниченного количества продуктов после определенного ID
    @GetMapping("/after/{id}/limit/{num}")
    public ResponseEntity<List<Produkt>> getNumOfProduktsAfterId(@PathVariable Long id, @PathVariable Long num) {
        List<Produkt> produkts = produktService.getNumOfProduktsAfterId(id, num);
        return ResponseEntity.ok(produkts);
    }

    // Получение ограниченного количества продуктов определенной категории после определенного ID
    @GetMapping("/category/{kategorieId}/after/{id}/limit/{num}")
    public ResponseEntity<List<Produkt>> getNumOfPodleKategorieProduktsAfterId(
            @PathVariable Long kategorieId,
            @PathVariable Long id,
            @PathVariable Long num) {
        KategorieProduktu kategorieProduktu = kategorieProduktuRepository.findById(kategorieId)
                .orElseThrow(() -> new ResourceNotFoundException("KategorieProduktu", "id", kategorieId));
        List<Produkt> produkts = produktService.getNumOfPodleKategorieProduktsAfterId(id, num, kategorieProduktu);
        return ResponseEntity.ok(produkts);
    }

    // Получение всех продуктов определенной категории с ограничением на количество
    @GetMapping("/category/{kategorieId}/limit/{num}")
    public ResponseEntity<List<Produkt>> getAllPodleKategorieProdukts(
            @PathVariable Long kategorieId,
            @PathVariable Long num) {
        KategorieProduktu kategorieProduktu = kategorieProduktuRepository.findById(kategorieId)
                .orElseThrow(() -> new ResourceNotFoundException("KategorieProduktu", "id", kategorieId));
        List<Produkt> produkts = produktService.getAllPodleKategorieProdukts(null, num, kategorieProduktu);
        return ResponseEntity.ok(produkts);
    }

    // Новый эндпоинт для получения только названий продуктов
    @GetMapping("/names")
    public ResponseEntity<List<String>> getAllProduktNames() {
        List<Produkt> produkts = produktService.getAllProdukts();
        List<String> produktNames = produkts.stream()
                .map(Produkt::getNazev)
                .collect(Collectors.toList());
        System.out.println(produktNames);
        return ResponseEntity.ok(produktNames);
    }
}
