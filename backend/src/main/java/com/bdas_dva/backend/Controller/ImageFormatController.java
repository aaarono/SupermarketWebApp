package com.bdas_dva.backend.Controller;

import com.bdas_dva.backend.Service.ImageFormatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/image-formats")
@CrossOrigin(origins = "http://localhost:3000")
public class ImageFormatController {

    @Autowired
    private ImageFormatService imageFormatService;

    /**
     * Получение всех форматов изображений
     */
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllImageFormats() {
        List<Map<String, Object>> formats = imageFormatService.getAllImageFormats();
        return ResponseEntity.ok(formats);
    }

    /**
     * Получение формата изображения по ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getImageFormatById(@PathVariable("id") Long id) {
        try {
            Map<String, Object> format = imageFormatService.getImageFormatById(id);
            return ResponseEntity.ok(format);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
