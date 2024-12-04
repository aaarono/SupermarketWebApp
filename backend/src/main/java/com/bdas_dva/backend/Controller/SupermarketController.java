package com.bdas_dva.backend.Controller;

import com.bdas_dva.backend.Model.Supermarket;
import com.bdas_dva.backend.Service.SupermarketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/supermarkets")
@CrossOrigin(origins = "http://localhost:3000")
public class SupermarketController {

    @Autowired
    private SupermarketService supermarketService;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllSupermarkets() {
        List<Map<String, Object>> supermarkets = supermarketService.getAllSupermarkets();
        return ResponseEntity.ok(supermarkets);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getSupermarketById(@PathVariable("id") Long id) {
        Map<String, Object> supermarket = supermarketService.getSupermarketById(id);
        return ResponseEntity.ok(supermarket);
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Map<String, Object>>> getFilteredSupermarkets(
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "city", required = false) String city) {
        List<Map<String, Object>> supermarkets = supermarketService.getFilteredSupermarkets(name, city);
        return ResponseEntity.ok(supermarkets);
    }

    @PostMapping
    public ResponseEntity<String> addSupermarket(@RequestBody Supermarket supermarketDTO) {
        supermarketService.addSupermarket(
                supermarketDTO.getName(),
                supermarketDTO.getPhone(),
                supermarketDTO.getEmail(),
                supermarketDTO.getAddressId(),
                supermarketDTO.getStreet(),
                supermarketDTO.getPostalCode(),
                supermarketDTO.getCity(),
                supermarketDTO.getBuildingNumber()
        );
        return ResponseEntity.ok("Supermarket added successfully.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateSupermarket(@PathVariable("id") Long id,
                                                    @RequestBody Supermarket supermarketDTO) {
        supermarketService.updateSupermarket(
                id,
                supermarketDTO.getName(),
                supermarketDTO.getPhone(),
                supermarketDTO.getEmail(),
                supermarketDTO.getAddressId(),
                supermarketDTO.getStreet(),
                supermarketDTO.getPostalCode(),
                supermarketDTO.getCity(),
                supermarketDTO.getBuildingNumber()
        );
        return ResponseEntity.ok("Supermarket updated successfully.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSupermarket(@PathVariable("id") Long id) {
        supermarketService.deleteSupermarket(id);
        return ResponseEntity.ok("Supermarket deleted successfully.");
    }
}
