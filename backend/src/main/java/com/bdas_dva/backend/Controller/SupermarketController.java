package com.bdas_dva.backend.Controller;

import com.bdas_dva.backend.Model.Supermarket;
import com.bdas_dva.backend.Service.SupermarketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/supermarkets")
@CrossOrigin(origins = "http://localhost:3000")
public class SupermarketController {

    @Autowired
    private SupermarketService supermarketService;

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
