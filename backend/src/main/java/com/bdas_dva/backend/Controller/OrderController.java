package com.bdas_dva.backend.Controller;

import com.bdas_dva.backend.Model.Order;
import com.bdas_dva.backend.Model.OrderRequest;
import com.bdas_dva.backend.Model.User;
import com.bdas_dva.backend.Service.OrderService;
import com.bdas_dva.backend.Service.UserService;
import com.bdas_dva.backend.Service.ZakaznikService;
import com.bdas_dva.backend.Util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataAccessException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;


    @PreAuthorize("hasRole('USER') or hasRole('EMPLOYEE') or hasRole('ADMIN')")
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

    @GetMapping("/user")
    public ResponseEntity<?> getUserOrders(@RequestParam(required = false) Long userId,
                                           @RequestParam(required = false) Long zakaznikId,
                                           @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            // Если userId не передан в параметрах запроса, берем его из JWT токена
            if (userId == null && authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                if (jwtUtil.validateToken(token)) {
                    String email = jwtUtil.getUserNameFromJwtToken(token);
                    User user = userService.getUserWithRoleByEmail(email);
                    if (user != null) {
                        userId = user.getIdUser(); // Получаем ID пользователя из токена
                    }
                } else {
                    return ResponseEntity.status(401).body("Invalid or expired token");
                }
            }

            // Если userId все еще null, возвращаем ошибку
            if (userId == null) {
                return ResponseEntity.status(400).body("User ID is required or must be provided in JWT token");
            }

            // Получаем заказы пользователя
            List<Order> orders = orderService.getUserOrders(userId, zakaznikId);
            return ResponseEntity.ok(orders);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка получения заказов: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    @PostMapping("/filter")
    public ResponseEntity<?> filterOrders(@RequestBody Map<String, String> filters) {
        try {
            String name = filters.get("name");
            String phone = filters.get("phone");
            String email = filters.get("email");

            List<Map<String, Object>> orders = orderService.filterOrders(name, phone, email);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка при фильтрации заказов: " + e.getMessage());
        }
    }
}
