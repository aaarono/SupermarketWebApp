package com.bdas_dva.backend.Controller;

import com.bdas_dva.backend.Model.OrderProduct.Order;
import com.bdas_dva.backend.Model.OrderProduct.OrderRequest;
import com.bdas_dva.backend.Model.OrderProduct.Product.Product;
import com.bdas_dva.backend.Model.User;
import com.bdas_dva.backend.Service.OrderService;
import com.bdas_dva.backend.Service.UserService;
import com.bdas_dva.backend.Util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataAccessException;
import org.springframework.security.core.GrantedAuthority;

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
    @PreAuthorize("hasRole('USER') or hasRole('EMPLOYEE') or hasRole('ADMIN')")
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
            Long statusId = filters.get("statusId") != null ? Long.valueOf(filters.get("statusId")) : null;

            List<Map<String, Object>> orders = orderService.filterOrders(name, phone, email, statusId);

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            boolean isEmployee = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .anyMatch(role -> role.equals("ROLE_EMPLOYEE"));

            if (isEmployee) {
                orders.forEach(order -> {
                    if (order.containsKey("CUSTOMER_PHONE")) {
                        String originalPhone = order.get("CUSTOMER_PHONE").toString();
                        if (originalPhone != null && !originalPhone.isEmpty()) {
                            order.put("CUSTOMER_PHONE", maskPhoneNumber(originalPhone));
                        }
                    }
                });
            }

            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Filtration error: " + e.getMessage());
        }
    }


    private String maskPhoneNumber(String phoneNumber) {
        if (phoneNumber.length() > 4) {
            return phoneNumber.substring(0, phoneNumber.length() - 4).replaceAll("[0-9]", "*")
                    + phoneNumber.substring(phoneNumber.length() - 4);
        }
        return phoneNumber.replaceAll("[0-9]", "*");
    }


    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    @GetMapping("/{orderId}/products")
    public ResponseEntity<?> getProductsByOrderId(@PathVariable("orderId") Long orderId) {
        try {
            List<Product> products = orderService.getProductsByOrderId(orderId);
            if (products.isEmpty()) {
                return ResponseEntity.status(404).body("Продукты для заказа с ID " + orderId + " не найдены.");
            }
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка при получении продуктов для заказа: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin")
    public ResponseEntity<?> createOrderAdmin(@RequestBody Map<String, Object> orderData) {
        try {
            Map<String, Object> response = orderService.handleOrderCUD("INSERT", orderData);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating order: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin")
    public ResponseEntity<?> updateOrder(@RequestBody Map<String, Object> orderData) {
        try {
            Map<String, Object> response = orderService.handleOrderCUD("UPDATE", orderData);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating order: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin")
    public ResponseEntity<?> deleteOrder(@RequestBody Map<String, Object> orderData) {
        try {
            Map<String, Object> response = orderService.handleOrderCUD("DELETE", orderData);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting order: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public ResponseEntity<?> getAllOrders() {
        try {
            List<Map<String, Object>> orders = orderService.getAllObjednavky();
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error retrieving users: " + e.getMessage());
        }
    }
}
