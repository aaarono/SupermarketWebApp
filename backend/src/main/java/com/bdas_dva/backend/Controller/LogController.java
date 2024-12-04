package com.bdas_dva.backend.Controller;

import com.bdas_dva.backend.Service.LogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = "http://localhost:3000")
public class LogController {

    @Autowired
    private LogService logService;

    /**
     * Получение всех записей логов
     */
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllLogs() {
        List<Map<String, Object>> logs = logService.getAllLogs();
        return ResponseEntity.ok(logs);
    }

    /**
     * Получение записи лога по ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getLogById(@PathVariable("id") Long id) {
        try {
            Map<String, Object> log = logService.getLogById(id);
            return ResponseEntity.ok(log);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Фильтрация записей логов
     */
    @GetMapping("/filter")
    public ResponseEntity<List<Map<String, Object>>> getLogsByFilters(
            @RequestParam(value = "operation", required = false) String operation,
            @RequestParam(value = "tableName", required = false) String tableName,
            @RequestParam(value = "modificationDate", required = false) String modificationDate
    ) {
        List<Map<String, Object>> logs = logService.getLogsByFilters(operation, tableName, modificationDate);
        return ResponseEntity.ok(logs);
    }
}
