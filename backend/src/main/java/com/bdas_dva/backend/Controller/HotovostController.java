// HotovostController.java

package com.bdas_dva.backend.Controller;

import com.bdas_dva.backend.Service.HotovostService;
import com.bdas_dva.backend.Model.OrderProduct.Platba.Hotovost;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
// Импортировать другие необходимые классы
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hotovost")
@CrossOrigin(origins = "http://localhost:3000")
public class HotovostController {

    private static final Logger logger = LoggerFactory.getLogger(HotovostController.class);

    @Autowired
    private HotovostService hotovostService;

    // Получение всех платежей наличными
    @GetMapping
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<List<Hotovost>> getHotovosts() {
        List<Hotovost> hotovosts = hotovostService.getAllHotovosts();
        return ResponseEntity.ok(hotovosts);
    }

    // Добавление нового платежа наличными
    @PostMapping
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<String> addHotovost(@RequestBody Map<String, Object> hotovostDTO) {
        try {
            Double prijato = hotovostDTO.get("prijato") != null ? Double.parseDouble(hotovostDTO.get("prijato").toString()) : null;
            Double vraceno = hotovostDTO.get("vraceno") != null ? Double.parseDouble(hotovostDTO.get("vraceno").toString()) : null;

            Long id = hotovostService.addHotovost(prijato, vraceno);
            return ResponseEntity.ok("Платеж наличными успешно добавлен. ID: " + id);
        } catch (Exception e) {
            logger.error("Ошибка при добавлении платежа наличными: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Ошибка при добавлении платежа наличными: " + e.getMessage());
        }
    }

    // Обновление платежа наличными
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> updateHotovost(@PathVariable("id") Long id, @RequestBody Map<String, Object> hotovostDTO) {
        try {
            Double prijato = hotovostDTO.get("prijato") != null ? Double.parseDouble(hotovostDTO.get("prijato").toString()) : null;
            Double vraceno = hotovostDTO.get("vraceno") != null ? Double.parseDouble(hotovostDTO.get("vraceno").toString()) : null;

            hotovostService.updateHotovost(id, prijato, vraceno);
            return ResponseEntity.ok("Платеж наличными успешно обновлен.");
        } catch (Exception e) {
            logger.error("Ошибка при обновлении платежа наличными: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Ошибка при обновлении платежа наличными: " + e.getMessage());
        }
    }

    // Удаление платежа наличными
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteHotovost(@PathVariable("id") Long id) {
        try {
            hotovostService.deleteHotovost(id);
            return ResponseEntity.ok("Платеж наличными успешно удален.");
        } catch (Exception e) {
            logger.error("Ошибка при удалении платежа наличными: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ошибка при удалении платежа наличными: " + e.getMessage());
        }
    }

    /**
     * Дополнительные методы, например, фильтрация или получение по ID, при необходимости
     */
}
