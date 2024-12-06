// src/main/java/com/bdas_dva/backend/Controller/ProductSupplierController.java

package com.bdas_dva.backend.Controller;

import com.bdas_dva.backend.Exception.ResourceNotFoundException;
import com.bdas_dva.backend.Model.ProductSupplier;
import com.bdas_dva.backend.Service.ProductSupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataAccessException;

import java.util.List;

@RestController
@RequestMapping("/api/product-suppliers")
public class ProductSupplierController {

    @Autowired
    private ProductSupplierService productSupplierService;

    /**
     * Получение всех связей продукт-поставщик.
     * Пример: GET /api/product-suppliers
     */
    @GetMapping
    public ResponseEntity<?> getAllProductSuppliers() {
        try {
            List<ProductSupplier> productSuppliers = productSupplierService.getAllProductSuppliers();
            return ResponseEntity.ok(productSuppliers);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка при получении списка связей продукт-поставщик");
        }
    }

    /**
     * Получение связи продукт-поставщик по составному ключу.
     * Пример: GET /api/product-suppliers?produktIdProduktu=1&DodavatelIdDodavatelyu=2
     */
    @GetMapping(params = {"produktIdProduktu", "DodavatelIdDodavatelyu"})
    public ResponseEntity<?> getProductSupplierByIds(
            @RequestParam("produktIdProduktu") Long produktIdProduktu,
            @RequestParam("DodavatelIdDodavatelyu") Long dodavatelIdDodavatelyu
    ) {
        try {
            ProductSupplier ps = productSupplierService.getProductSupplierByIds(produktIdProduktu, dodavatelIdDodavatelyu);
            return ResponseEntity.ok(ps);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка при получении связи продукт-поставщик");
        }
    }

    /**
     * Создание новой связи продукт-поставщик.
     * Пример: POST /api/product-suppliers
     * Тело запроса:
     * {
     *   "DODAVATEL_ID_DODAVATELU": 2,
     *   "PRODUKT_ID_PRODUKTU": 1,
     *   "supplyPrice": 100.50,
     *   "supplyDate": "2023-01-01"
     * }
     */
    @PostMapping
    public ResponseEntity<?> createProductSupplier(@RequestBody ProductSupplier productSupplier) {
        try {
            // Валидация входных данных
            if (productSupplier.getDodavatelIdDodavatelyu() == null) {
                return ResponseEntity.badRequest().body("DODAVATEL_ID_DODAVATELU не может быть пустым");
            }
            if (productSupplier.getProduktIdProduktu() == null) {
                return ResponseEntity.badRequest().body("PRODUKT_ID_PRODUKTU не может быть пустым");
            }

            productSupplierService.createProductSupplier(productSupplier);
            return ResponseEntity.status(201).body("Связь продукт-поставщик создана успешно");
        } catch (DataAccessException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка при создании связи продукт-поставщик");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Произошла ошибка при создании связи продукт-поставщик");
        }
    }

    /**
     * Обновление существующей связи продукт-поставщик.
     * Пример: PUT /api/product-suppliers
     * Тело запроса:
     * {
     *   "DODAVATEL_ID_DODAVATELU": 2,
     *   "PRODUKT_ID_PRODUKTU": 1,
     *   "supplyPrice": 120.75,
     *   "supplyDate": "2023-02-01"
     * }
     */
    @PutMapping
    public ResponseEntity<?> updateProductSupplier(@RequestBody ProductSupplier productSupplier) {
        try {
            // Валидация входных данных
            if (productSupplier.getDodavatelIdDodavatelyu() == null || productSupplier.getProduktIdProduktu() == null) {
                return ResponseEntity.badRequest().body("DODAVATEL_ID_DODAVATELU и PRODUKT_ID_PRODUKTU не могут быть пустыми");
            }
            if (productSupplier.getSupplyPrice() == null || productSupplier.getSupplyPrice() <= 0) {
                return ResponseEntity.badRequest().body("Цена поставки должна быть положительной");
            }
            if (productSupplier.getSupplyDate() == null || productSupplier.getSupplyDate().isEmpty()) {
                return ResponseEntity.badRequest().body("Дата поставки не может быть пустой");
            }

            productSupplierService.updateProductSupplier(productSupplier);
            return ResponseEntity.ok("Связь продукт-поставщик обновлена успешно");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (DataAccessException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка при обновлении связи продукт-поставщик");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Произошла ошибка при обновлении связи продукт-поставщик");
        }
    }

    /**
     * Удаление связи продукт-поставщик.
     * Пример: DELETE /api/product-suppliers?produktIdProduktu=1&DodavatelIdDodavatelyu=2
     */
    @DeleteMapping
    public ResponseEntity<?> deleteProductSupplier(
            @RequestParam("produktIdProduktu") Long produktIdProduktu,
            @RequestParam("DodavatelIdDodavatelyu") Long dodavatelIdDodavatelyu
    ) {
        try {
            productSupplierService.deleteProductSupplier(produktIdProduktu, dodavatelIdDodavatelyu);
            return ResponseEntity.ok("Связь продукт-поставщик удалена успешно");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (DataAccessException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка при удалении связи продукт-поставщик");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Произошла ошибка при удалении связи продукт-поставщик");
        }
    }

    /**
     * Поиск связей продукт-поставщик по фильтрам.
     * Пример: GET /api/product-suppliers/search?produktIdProduktu=1&DodavatelIdDodavatelyu=2&supplyPrice=100.50&supplyDate=2023-01-01
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchProductSuppliers(
            @RequestParam(value = "produktIdProduktu", required = false) Long produktIdProduktu,
            @RequestParam(value = "DodavatelIdDodavatelyu", required = false) Long dodavatelIdDodavatelyu
    ) {
        try {
            List<ProductSupplier> productSuppliers = productSupplierService.getAllProductSuppliers();
            // Фильтрация на уровне Java (рекомендуется реализовать на уровне SQL)
            if (produktIdProduktu != null) {
                productSuppliers.removeIf(ps -> !ps.getProduktIdProduktu().equals(produktIdProduktu));
            }
            if (dodavatelIdDodavatelyu != null) {
                productSuppliers.removeIf(ps -> !ps.getDodavatelIdDodavatelyu().equals(dodavatelIdDodavatelyu));
            }
            return ResponseEntity.ok(productSuppliers);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка при поиске связей продукт-поставщик");
        }
    }
}
