// UtilController.java
package com.bdas_dva.backend.Controller;

import com.bdas_dva.backend.Model.Log;
import com.bdas_dva.backend.Service.UtilService;
import com.bdas_dva.backend.Model.Pozice;
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

    /**
     * Создание новой роли (INSERT).
     * @param body Тело запроса с полем roleName.
     * @return Ответ об успешности выполнения операции.
     */
    @PostMapping("/roles")
    public ResponseEntity<?> createRole(@RequestBody Map<String, Object> body) {
        try {
            String roleName = (String) body.get("ROLENAME");
            utilService.executeRoleCUD("INSERT", null, roleName);
            return ResponseEntity.ok("Роль успешно создана.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка при создании роли: " + e.getMessage());
        }
    }

    /**
     * Обновление существующей роли (UPDATE).
     * @param body Тело запроса с полями idRole и roleName.
     * @return Ответ об успешности выполнения операции.
     */
    @PutMapping("/roles")
    public ResponseEntity<?> updateRole(@RequestBody Map<String, Object> body) {
        try {
            Long idRole = body.containsKey("idRole") ? Long.valueOf(body.get("idRole").toString()) : null;
            String roleName = (String) body.get("ROLENAME");
            utilService.executeRoleCUD("UPDATE", idRole, roleName);
            return ResponseEntity.ok("Роль успешно обновлена.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка при обновлении роли: " + e.getMessage());
        }
    }

    /**
     * Удаление существующей роли (DELETE).
     * @param idRole ID роли, которую нужно удалить.
     * @return Ответ об успешности выполнения операции.
     */
    @DeleteMapping("/roles/{idRole}")
    public ResponseEntity<?> deleteRole(@PathVariable("idRole") Long idRole) {
        try {
            utilService.executeRoleCUD("DELETE", idRole, null);
            return ResponseEntity.ok("Роль успешно удалена.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка при удалении роли: " + e.getMessage());
        }
    }

    /**
     * Получить логи из таблицы log через хранимую процедуру proc_log_r.
     * @param idLogu ID лога (опционально).
     * @param limit Лимит записей (опционально).
     * @return Список логов.
     */
    @GetMapping("/logs")
    public ResponseEntity<?> getLogs(
            @RequestParam(value = "idLogu", required = false) Long idLogu,
            @RequestParam(value = "limit", required = false) Integer limit) {
        try {
            List<Log> logs = utilService.getLogs(idLogu, limit);
            return ResponseEntity.ok(logs);
        } catch (Exception e) {
            e.printStackTrace(); 
            return ResponseEntity.status(500).body("Ошибка при получении логов: " + e.getMessage());
        }
    }

}
