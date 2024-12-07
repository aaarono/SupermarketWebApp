package com.bdas_dva.backend.Controller;

import com.bdas_dva.backend.Service.OrderStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/order-statuses")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderStatusController {

    @Autowired
    private OrderStatusService orderStatusService;

    /**
     * Создание нового статуса заказа.
     */
    @PostMapping
    public ResponseEntity<?> createStatus(@RequestBody Map<String, String> statusRequest) {
        try {
            String nazev = statusRequest.get("NAZEV");
            orderStatusService.executeCUD("CREATE", null, nazev);
            return ResponseEntity.ok("Статус успешно создан.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка при создании статуса: " + e.getMessage());
        }
    }

    /**
     * Обновление существующего статуса заказа.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> statusRequest) {
        try {
            String nazev = statusRequest.get("NAZEV");
            orderStatusService.executeCUD("UPDATE", id, nazev);
            return ResponseEntity.ok("Статус успешно обновлен.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка при обновлении статуса: " + e.getMessage());
        }
    }

    /**
     * Удаление статуса заказа.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStatus(@PathVariable Long id) {
        try {
            orderStatusService.executeCUD("DELETE", id, null);
            return ResponseEntity.ok("Статус успешно удален.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка при удалении статуса: " + e.getMessage());
        }
    }

    /**
     * Получение статуса по ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getStatusById(@PathVariable Long id) {
        try {
            Map<String, Object> status = orderStatusService.executeRead(id);
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(404).body("Статус с ID " + id + " не найден.");
        }
    }

    /**
     * Получение всех статусов заказов.
     */
    @GetMapping
    public ResponseEntity<?> getAllStatuses() {
        try {
            List<Map<String, Object>> statuses = orderStatusService.executeReadAll();
            return ResponseEntity.ok(statuses);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка при получении статусов: " + e.getMessage());
        }
    }
}
