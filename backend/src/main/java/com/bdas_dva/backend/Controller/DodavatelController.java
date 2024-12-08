package com.bdas_dva.backend.Controller;

import com.bdas_dva.backend.Service.DodavatelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dodavatele")
@CrossOrigin(origins = "http://localhost:3000")
public class DodavatelController {

    @Autowired
    private DodavatelService dodavatelService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> createDodavatel(@RequestBody Map<String, Object> dodavatel) {
        try {
            dodavatelService.addDodavatel(
                    (String) dodavatel.get("NAZEV"),
                    (String) dodavatel.get("KONTAKTNI_OSOBA"),
                    Long.parseLong(dodavatel.get("TELEFON").toString()),
                    (String) dodavatel.get("EMAIL")
            );
            return ResponseEntity.ok("Dodavatel created successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error creating dodavatel: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> updateDodavatel(
            @PathVariable("id") Long id,
            @RequestBody Map<String, Object> dodavatel) {
        try {
            dodavatelService.updateDodavatel(
                    id,
                    (String) dodavatel.get("NAZEV"),
                    (String) dodavatel.get("KONTAKTNI_OSOBA"),
                    Long.parseLong(dodavatel.get("TELEFON").toString()),
                    (String) dodavatel.get("EMAIL")
            );
            return ResponseEntity.ok("Dodavatel updated successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error updating dodavatel: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteDodavatel(@PathVariable("id") Long id) {
        try {
            dodavatelService.deleteDodavatel(id);
            return ResponseEntity.ok("Dodavatel deleted successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error deleting dodavatel: " + e.getMessage());
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getAllDodavatele() {
        try {
            List<Map<String, Object>> dodavatele = dodavatelService.getAllDodavatele();
            return ResponseEntity.ok(dodavatele);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDodavatelById(@PathVariable("id") Long id) {
        try {
            Map<String, Object> dodavatel = dodavatelService.getDodavatelById(id);
            return ResponseEntity.ok(dodavatel);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }
}
