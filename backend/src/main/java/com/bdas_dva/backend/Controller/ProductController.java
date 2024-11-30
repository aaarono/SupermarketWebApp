// ProductController.java
package com.bdas_dva.backend.Controller;

import com.bdas_dva.backend.Model.Product;
import com.bdas_dva.backend.Service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
}
