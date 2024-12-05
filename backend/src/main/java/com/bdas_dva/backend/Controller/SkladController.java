package com.bdas_dva.backend.Controller;

import com.bdas_dva.backend.Model.Sklad;
import com.bdas_dva.backend.Service.SkladService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sklads")
@CrossOrigin(origins = "http://localhost:3000")
public class SkladController {

    @Autowired
    private SkladService skladService;

    @PostMapping
    public ResponseEntity<String> addSklad(@RequestBody Map<String, Object> skladDTO) {
        skladService.addSklad(
                (String) skladDTO.get("NAZEV"),
                skladDTO.get("TELEFON") != null ? Long.parseLong(skladDTO.get("TELEFON").toString()) : null,
                (String) skladDTO.get("EMAIL"),
                skladDTO.get("ADRESA_ID_ADRESY") != null ? Long.parseLong(skladDTO.get("ADRESA_ID_ADRESY").toString()) : null
        );
        return ResponseEntity.ok("Склад успешно добавлен.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateSklad(@PathVariable("id") Long id, @RequestBody Map<String, Object> skladDTO) {
        skladService.updateSklad(
                id,
                (String) skladDTO.get("NAZEV"),
                skladDTO.get("TELEFON") != null ? Long.parseLong(skladDTO.get("TELEFON").toString()) : null,
                (String) skladDTO.get("EMAIL"),
                skladDTO.get("ADRESA_ID_ADRESY") != null ? Long.parseLong(skladDTO.get("ADRESA_ID_ADRESY").toString()) : null
        );
        return ResponseEntity.ok("Склад успешно обновлен.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSklad(@PathVariable("id") Long id) {
        skladService.deleteSklad(id);
        return ResponseEntity.ok("Склад успешно удален.");
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllSklady() {
        return ResponseEntity.ok(skladService.getAllSklady());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getSkladById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(skladService.getSkladById(id));
    }
}
