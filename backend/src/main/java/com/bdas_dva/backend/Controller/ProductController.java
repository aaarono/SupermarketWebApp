// ProductController.java
package com.bdas_dva.backend.Controller;

import com.bdas_dva.backend.Model.ImageData;
import com.bdas_dva.backend.Model.Product;
import com.bdas_dva.backend.Service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.header.Header;
import org.springframework.web.bind.annotation.*;

import java.sql.Blob;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> getProducts(
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
}
