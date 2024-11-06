package com.bdas_dva.backend.Controller;

import com.bdas_dva.backend.Model.Produkt;
import com.bdas_dva.backend.Model.Supermarket;
import com.bdas_dva.backend.Service.SupermarketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/supermarkets")
@CrossOrigin(origins = "http://localhost:3000")
public class SupermarketController {

    @Autowired
    private SupermarketService supermarketService;

    //TODO Добавить авторизацию для админов
    //@PreAuthorize("hasRole('Admin')")
    @PostMapping
    public ResponseEntity<Supermarket> createSupermarket(@RequestBody Supermarket supermarket) {
        Supermarket createdSupermarket = supermarketService.createSupermarket(supermarket);
        return ResponseEntity.ok(createdSupermarket);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Supermarket> getSupermarketById(@PathVariable Long id) {
        Supermarket supermarket = supermarketService.getSupermarketById(id);
        return ResponseEntity.ok(supermarket);
    }

    @GetMapping
    public ResponseEntity<List<Supermarket>> getAllSupermarkets() {
        List<Supermarket> supermarkets = supermarketService.getAllSupermarkets();
        return ResponseEntity.ok(supermarkets);
    }


    //TODO Добавить авторизацию для админов
    //@PreAuthorize("hasRole('Admin')")
    @PutMapping("/{id}")
    public ResponseEntity<Supermarket> updateSupermarket(@PathVariable Long id, @RequestBody Supermarket supermarketDetails) {
        Supermarket updatedSupermarket = supermarketService.updateSupermarket(id, supermarketDetails);
        return ResponseEntity.ok(updatedSupermarket);
    }

    //TODO Добавить авторизацию для админов
    //@PreAuthorize("hasRole('Admin')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSupermarket(@PathVariable Long id) {
        supermarketService.deleteSupermarket(id);
        return ResponseEntity.ok().build();
    }

    // Новый эндпоинт для получения только названий продуктов
    @GetMapping("/names")
    public ResponseEntity<List<String>> getAllProduktNames() {
        List<Supermarket> produkts = supermarketService.getAllSupermarkets();
        List<String> produktNames = produkts.stream()
                .map(Supermarket::getNazev)
                .collect(Collectors.toList());
        System.out.println(produktNames);
        return ResponseEntity.ok(produktNames);
    }
}
