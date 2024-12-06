// UtilController.java
package com.bdas_dva.backend.Controller;

import com.bdas_dva.backend.Service.UtilService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/util")
public class UtilController {

    @Autowired
    private UtilService utilService;

    /**
     * Получить объекты для указанного владельца.
     * @return Список объектов и их типов.
     */
    @GetMapping("/objects")
    public ResponseEntity<?> getObjectsByOwner() {
        try {
            // Получить данные через UtilService
            List<Map<String, Object>> objects = utilService.getObjectsByOwner("ST67003");
            return ResponseEntity.ok(objects);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка при получении объектов: " + e.getMessage());
        }
    }

    /**
     * Получить все роли из таблицы ROLE.
     * @return Список ролей.
     */
    @GetMapping("/roles")
    public ResponseEntity<?> getUserRoles(HttpServletRequest request) {
        try {
            // Получить роли через UtilService
            List<Map<String, Object>> roles = utilService.getAllRoles();
            return ResponseEntity.ok(roles);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка при получении ролей: " + e.getMessage());
        }
    }
}
