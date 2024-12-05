// KartaController.java

package com.bdas_dva.backend.Controller;

import com.bdas_dva.backend.Service.KartaService;
import com.bdas_dva.backend.Model.Karta;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
// Импортировать другие необходимые классы
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/karta")
@CrossOrigin(origins = "http://localhost:3000")
public class KartaController {

    private static final Logger logger = LoggerFactory.getLogger(KartaController.class);

    @Autowired
    private KartaService kartaService;

    // Получение всех карт
    @GetMapping
    public ResponseEntity<List<Karta>> getKarty() {
        try {
            List<Karta> karty = kartaService.getAllKarty();
            return ResponseEntity.ok(karty);
        } catch (Exception e) {
            logger.error("Ошибка при получении карт: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Добавление новой карты
    @PostMapping
    public ResponseEntity<String> addKarta(@RequestBody Map<String, Object> kartaDTO) {
        try {
            String cisloKarty = (String) kartaDTO.get("cisloKarty");

            if (cisloKarty == null || cisloKarty.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Поле 'cisloKarty' обязательно для заполнения.");
            }

            Long newId = kartaService.addKarta(cisloKarty);
            return ResponseEntity.ok("Карта успешно добавлена. ID_PLATBY: " + newId);
        } catch (Exception e) {
            logger.error("Ошибка при добавлении карты: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Ошибка при добавлении карты: " + e.getMessage());
        }
    }

    // Обновление карты
    @PutMapping("/{id}")
    public ResponseEntity<String> updateKarta(@PathVariable("id") Long id, @RequestBody Map<String, Object> kartaDTO) {
        try {
            String cisloKarty = (String) kartaDTO.get("cisloKarty");

            if (cisloKarty == null || cisloKarty.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Поле 'cisloKarty' обязательно для заполнения.");
            }

            kartaService.updateKarta(id, cisloKarty);
            return ResponseEntity.ok("Карта успешно обновлена.");
        } catch (Exception e) {
            logger.error("Ошибка при обновлении карты: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Ошибка при обновлении карты: " + e.getMessage());
        }
    }

    // Удаление карты
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteKarta(@PathVariable("id") Long id) {
        try {
            kartaService.deleteKarta(id);
            return ResponseEntity.ok("Карта успешно удалена.");
        } catch (Exception e) {
            logger.error("Ошибка при удалении карты: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ошибка при удалении карты: " + e.getMessage());
        }
    }

    /**
     * Дополнительные методы, например, фильтрация или получение по ID, при необходимости
     */
}
