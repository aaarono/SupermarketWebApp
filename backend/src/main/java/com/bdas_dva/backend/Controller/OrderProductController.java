// src/main/java/com/bdas_dva/backend/Controller/OrderProductController.java

package com.bdas_dva.backend.Controller;

import com.bdas_dva.backend.Exception.ResourceNotFoundException;
import com.bdas_dva.backend.Model.OrderProduct.OrderProduct;
import com.bdas_dva.backend.Service.OrderProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataAccessException;

import java.util.List;

@RestController
@RequestMapping("/api/order-products")
public class OrderProductController {

    @Autowired
    private OrderProductService orderProductService;

    /**
     * Получение всех связей заказ-продукт.
     * Пример: GET /api/order-products
     */
    @GetMapping
    public ResponseEntity<?> getAllOrderProducts() {
        try {
            List<OrderProduct> orderProducts = orderProductService.getAllOrderProducts();
            return ResponseEntity.ok(orderProducts);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка при получении списка связей заказ-продукт");
        }
    }

    /**
     * Получение связи заказ-продукт по составному ключу.
     * Пример: GET /api/order-products?objednavkaIdObjednavky=1&produktIdProduktu=2
     */
    @GetMapping(params = {"objednavkaIdObjednavky", "produktIdProduktu"})
    public ResponseEntity<?> getOrderProductByIds(
            @RequestParam("objednavkaIdObjednavky") Long objednavkaIdObjednavky,
            @RequestParam("produktIdProduktu") Long produktIdProduktu
    ) {
        try {
            OrderProduct op = orderProductService.getOrderProductByIds(objednavkaIdObjednavky, produktIdProduktu);
            return ResponseEntity.ok(op);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка при получении связи заказ-продукт");
        }
    }

    /**
     * Создание новой связи заказ-продукт.
     * Пример: POST /api/order-products
     * Тело запроса:
     * {
     *   "objednavkaIdObjednavky": 1,
     *   "produktIdProduktu": 2,
     *   "quantity": 5
     * }
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createOrderProduct(@RequestBody OrderProduct orderProduct) {
        try {
            // Валидация входных данных
            if (orderProduct.getOrderId() == null) {
                return ResponseEntity.badRequest().body("ID заказа не может быть пустым");
            }
            if (orderProduct.getProductId() == null) {
                return ResponseEntity.badRequest().body("ID продукта не может быть пустым");
            }
            if (orderProduct.getQuantity() == null || orderProduct.getQuantity() <= 0) {
                return ResponseEntity.badRequest().body("Количество должно быть положительным");
            }

            orderProductService.createOrderProduct(orderProduct);
            return ResponseEntity.status(201).body("Связь заказ-продукт создана успешно");
        } catch (DataAccessException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка при создании связи заказ-продукт");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Произошла ошибка при создании связи заказ-продукт");
        }
    }

    /**
     * Обновление существующей связи заказ-продукт.
     * Пример: PUT /api/order-products
     * Тело запроса:
     * {
     *   "objednavkaIdObjednavky": 1,
     *   "produktIdProduktu": 2,
     *   "quantity": 10
     * }
     */
    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateOrderProduct(@RequestBody OrderProduct orderProduct) {
        try {
            // Валидация входных данных
            if (orderProduct.getOrderId() == null || orderProduct.getProductId() == null) {
                return ResponseEntity.badRequest().body("ID заказа и ID продукта не могут быть пустыми");
            }
            if (orderProduct.getQuantity() == null || orderProduct.getQuantity() <= 0) {
                return ResponseEntity.badRequest().body("Количество должно быть положительным");
            }

            orderProductService.updateOrderProduct(orderProduct);
            return ResponseEntity.ok("Связь заказ-продукт обновлена успешно");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (DataAccessException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка при обновлении связи заказ-продукт");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Произошла ошибка при обновлении связи заказ-продукт");
        }
    }

    /**
     * Удаление связи заказ-продукт.
     * Пример: DELETE /api/order-products?objednavkaIdObjednavky=1&produktIdProduktu=2
     */
    @DeleteMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteOrderProduct(
            @RequestParam("objednavkaIdObjednavky") Long objednavkaIdObjednavky,
            @RequestParam("produktIdProduktu") Long produktIdProduktu
    ) {
        try {
            orderProductService.deleteOrderProduct(objednavkaIdObjednavky, produktIdProduktu);
            return ResponseEntity.ok("Связь заказ-продукт удалена успешно");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (DataAccessException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка при удалении связи заказ-продукт");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Произошла ошибка при удалении связи заказ-продукт");
        }
    }

    /**
     * Поиск связей заказ-продукт по фильтрам.
     * Пример: GET /api/order-products/search?objednavkaIdObjednavky=1&produktIdProduktu=2
     */
    @GetMapping("/search")
    @PreAuthorize("hasRole('USER') or hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<?> searchOrderProducts(
            @RequestParam(value = "objednavkaIdObjednavky", required = false) Long objednavkaIdObjednavky,
            @RequestParam(value = "produktIdProduktu", required = false) Long produktIdProduktu,
            @RequestParam(value = "quantity", required = false) Integer quantity
    ) {
        try {
            List<OrderProduct> orderProducts = orderProductService.getAllOrderProducts(); // Можно расширить метод для фильтрации
            // Фильтрация на уровне Java (можно улучшить с помощью SQL-запросов)
            if (objednavkaIdObjednavky != null) {
                orderProducts.removeIf(op -> !op.getOrderId().equals(objednavkaIdObjednavky));
            }
            if (produktIdProduktu != null) {
                orderProducts.removeIf(op -> !op.getProductId().equals(produktIdProduktu));
            }
            if (quantity != null) {
                orderProducts.removeIf(op -> !op.getQuantity().equals(quantity));
            }
            return ResponseEntity.ok(orderProducts);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка при поиске связей заказ-продукт");
        }
    }
}
