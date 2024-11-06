package com.bdas_dva.backend.Controller;

import com.bdas_dva.backend.Model.Sklad;
import com.bdas_dva.backend.Service.SkladService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/sklads")
@CrossOrigin(origins = "http://localhost:3000") // Замените на адрес вашего фронтенда
public class SkladController {

    @Autowired
    private SkladService skladService;

    //TODO Добавить авторизацию для админов
    //@PreAuthorize("hasRole('Admin')")
    @PostMapping
    public ResponseEntity<Sklad> createSklad(@RequestBody Sklad sklad) {
        Sklad createdSklad = skladService.createSklad(sklad);
        return ResponseEntity.ok(createdSklad);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sklad> getSkladById(@PathVariable Long id) {
        Sklad sklad = skladService.getSkladById(id);
        return ResponseEntity.ok(sklad);
    }

    @GetMapping
    public ResponseEntity<List<Sklad>> getAllSklads() {
        List<Sklad> sklads = skladService.getAllSklads();
        return ResponseEntity.ok(sklads);
    }

    //TODO Добавить авторизацию для админов
    //@PreAuthorize("hasRole('Admin')")
    @PutMapping("/{id}")
    public ResponseEntity<Sklad> updateSklad(@PathVariable Long id, @RequestBody Sklad skladDetails) {
        Sklad updatedSklad = skladService.updateSklad(id, skladDetails);
        return ResponseEntity.ok(updatedSklad);
    }

    //TODO Добавить авторизацию для админов
    //@PreAuthorize("hasRole('Admin')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSklad(@PathVariable Long id) {
        skladService.deleteSklad(id);
        return ResponseEntity.ok().build();
    }
}
