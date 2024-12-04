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
    public ResponseEntity<String> addSklad(@RequestBody Sklad skladDTO) {
        skladService.addSklad(
                skladDTO.getName(),
                skladDTO.getPhone(),
                skladDTO.getEmail(),
                skladDTO.getAddressId(),
                skladDTO.getStreet(),
                skladDTO.getPostalCode(),
                skladDTO.getCity(),
                skladDTO.getBuildingNumber()
        );
        return ResponseEntity.ok("Sklad added successfully.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateSklad(@PathVariable("id") Long id, @RequestBody Sklad skladDTO) {
        skladService.updateSklad(
                id,
                skladDTO.getName(),
                skladDTO.getPhone(),
                skladDTO.getEmail(),
                skladDTO.getAddressId(),
                skladDTO.getStreet(),
                skladDTO.getPostalCode(),
                skladDTO.getCity(),
                skladDTO.getBuildingNumber()
        );
        return ResponseEntity.ok("Sklad updated successfully.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSklad(@PathVariable("id") Long id) {
        skladService.deleteSklad(id);
        return ResponseEntity.ok("Sklad deleted successfully.");
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllSklady() {
        List<Map<String, Object>> sklady = skladService.getAllSklady();
        return ResponseEntity.ok(sklady);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getSkladById(@PathVariable("id") Long id) {
        Map<String, Object> sklad = skladService.getSkladById(id);
        return ResponseEntity.ok(sklad);
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Map<String, Object>>> getFilteredSklady(
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "city", required = false) String city) {
        List<Map<String, Object>> sklady = skladService.getFilteredSklady(name, city);
        return ResponseEntity.ok(sklady);
    }
}
