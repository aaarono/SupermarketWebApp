package com.bdas_dva.backend.Controller;

import com.bdas_dva.backend.Model.OrderRequest;
import com.bdas_dva.backend.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataAccessException;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest) {
        try {
            orderService.createOrder(orderRequest);
            return ResponseEntity.ok().body("Order created successfully!");
        } catch (DataAccessException dae) {
            // Обработка ошибок базы данных
            dae.printStackTrace();
            return ResponseEntity.status(500).body("Database error occurred while creating the order.");
        } catch (Exception e) {
            // Общая обработка ошибок
            e.printStackTrace();
            return ResponseEntity.status(500).body("An error occurred while creating the order.");
        }
    }
}
