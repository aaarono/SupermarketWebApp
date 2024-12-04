package com.bdas_dva.backend.Controller;

import com.bdas_dva.backend.Model.Dodavatel;
import com.bdas_dva.backend.Service.DodavatelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dodavatele")
@CrossOrigin(origins = "http://localhost:3000")
public class DodavatelController {

    @Autowired
    private DodavatelService dodavatelService;

    @PostMapping
    public ResponseEntity<String> addDodavatel(@RequestBody Dodavatel dodavatel) {
        dodavatelService.addDodavatel(
                dodavatel.getName(),
                dodavatel.getContactPerson(),
                dodavatel.getPhone(),
                dodavatel.getEmail()
        );
        return ResponseEntity.ok("Dodavatel added successfully.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateDodavatel(@PathVariable("id") Long id, @RequestBody Dodavatel dodavatel) {
        dodavatelService.updateDodavatel(
                id,
                dodavatel.getName(),
                dodavatel.getContactPerson(),
                dodavatel.getPhone(),
                dodavatel.getEmail()
        );
        return ResponseEntity.ok("Dodavatel updated successfully.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDodavatel(@PathVariable("id") Long id) {
        dodavatelService.deleteDodavatel(id);
        return ResponseEntity.ok("Dodavatel deleted successfully.");
    }
}
