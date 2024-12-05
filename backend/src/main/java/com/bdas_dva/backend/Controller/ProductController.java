package com.bdas_dva.backend.Controller;

import com.bdas_dva.backend.Model.ImageData;
import com.bdas_dva.backend.Model.Product;
import com.bdas_dva.backend.Service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping
    public ResponseEntity<String> addProduct(@RequestBody Map<String, Object> productDTO) {
        productService.addProduct(
                (String) productDTO.get("name"),
                productDTO.get("price") != null ? Double.parseDouble(productDTO.get("price").toString()) : null,
                (String) productDTO.get("description"),
                productDTO.get("categoryId") != null ? Integer.parseInt(productDTO.get("categoryId").toString()) : null,
                productDTO.get("skladId") != null ? Integer.parseInt(productDTO.get("skladId").toString()) : null
        );
        return ResponseEntity.ok("Продукт успешно добавлен.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateProduct(@PathVariable("id") Long id, @RequestBody Map<String, Object> productDTO) {
        productService.updateProduct(
                id,
                (String) productDTO.get("name"),
                productDTO.get("price") != null ? Double.parseDouble(productDTO.get("price").toString()) : null,
                (String) productDTO.get("description"),
                productDTO.get("categoryId") != null ? Integer.parseInt(productDTO.get("categoryId").toString()) : null,
                productDTO.get("skladId") != null ? Integer.parseInt(productDTO.get("skladId").toString()) : null
        );
        return ResponseEntity.ok("Продукт успешно обновлен.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable("id") Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok("Продукт успешно удален.");
    }
    

    private final Map<String, Integer> formatMapping = Map.of(
            "jpg", 1,
            "png", 2,
            "gif", 3,
            "bmp", 4,
            "tiff", 5,
            "webp", 6
    );

    @GetMapping
    public List<Product> getProducts(
            @RequestParam(required = false) String searchQuery,
            @RequestParam(defaultValue = "all") String category
    ) {
        return productService.getProductsImage(searchQuery, category);
    }

    @GetMapping("/list")
    public List<Product> getProductsList(
            @RequestParam(required = false) String searchQuery,
            @RequestParam(defaultValue = "all") String category
    ) {
        return productService.getProducts(searchQuery, category);
    }

    @GetMapping("/image/{productId}")
    public ResponseEntity<String> getProductImage(@PathVariable Long productId) {
        ImageData imageData = productService.getProductImage(productId);
        if (imageData != null && imageData.getImage() != null) {
            try {
                // Получаем изображение в Base64
                String base64Image = imageData.getImage();

                // Устанавливаем заголовки
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.TEXT_PLAIN); // Base64 строка — это текст

                return new ResponseEntity<>(base64Image, headers, HttpStatus.OK);
            } catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/image")
    public ResponseEntity<String> addProductImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("productId") Long productId,
            @RequestParam("name") String name
    ) {
        try {
            // Определяем тип файла
            String fileType = file.getContentType();
            String extension = fileType != null ? fileType.split("/")[1] : null;

            // Проверяем, поддерживается ли формат
            if (extension == null || !formatMapping.containsKey(extension)) {
                return ResponseEntity.badRequest().body("Unsupported file format.");
            }

            Integer formatId = formatMapping.get(extension);

            // Сохраняем изображение
            productService.addProductImage(
                    productId,
                    file.getBytes(),
                    name,
                    fileType,
                    formatId
            );

            return ResponseEntity.ok("Image added successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding image.");
        }
    }

    @PutMapping("/image")
    public ResponseEntity<String> updateProductImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("productId") Long productId,
            @RequestParam("name") String name
    ) {
        try {
            // Определяем тип файла
            String fileType = file.getContentType();
            String extension = fileType != null ? fileType.split("/")[1] : null;

            // Проверяем, поддерживается ли формат
            if (extension == null || !formatMapping.containsKey(extension)) {
                return ResponseEntity.badRequest().body("Unsupported file format.");
            }

            Integer formatId = formatMapping.get(extension);

            // Обновляем изображение
            productService.updateProductImage(
                    productId,
                    file.getBytes(),
                    name,
                    fileType,
                    formatId
            );

            return ResponseEntity.ok("Image updated successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating image.");
        }
    }

    @DeleteMapping("/image/{productId}")
    public ResponseEntity<String> deleteProductImage(@PathVariable Long productId) {
        try {
            productService.deleteProductImage(productId);
            return ResponseEntity.ok("Image deleted successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting image.");
        }
    }
}
