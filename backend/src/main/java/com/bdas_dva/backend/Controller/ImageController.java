package com.bdas_dva.backend.Controller;

import com.bdas_dva.backend.Service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "http://localhost:3000")
public class ImageController {

    @Autowired
    private ImageService imageService;

    /**
     * Получение всех изображений (только метаданные)
     */
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllImages() {
        List<Map<String, Object>> images = imageService.getAllImages();
        return ResponseEntity.ok(images);
    }

    /**
     * Получение метаданных изображения по ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getImageById(@PathVariable("id") Long id) {
        try {
            Map<String, Object> image = imageService.getImageById(id);
            return ResponseEntity.ok(image);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Фильтрация изображений по продукту или формату
     */
    @GetMapping("/filter")
    public ResponseEntity<List<Map<String, Object>>> getImagesByFilters(
            @RequestParam(value = "productId", required = false) Long productId,
            @RequestParam(value = "formatId", required = false) Integer formatId
    ) {
        List<Map<String, Object>> images = imageService.getImagesByFilters(productId, formatId);
        return ResponseEntity.ok(images);
    }
}
