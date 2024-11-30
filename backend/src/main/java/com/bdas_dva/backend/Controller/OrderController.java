package com.bdas_dva.backend.Controller;

import com.bdas_dva.backend.dto.OrderRequest;
import com.bdas_dva.backend.dto.OrderResponse;
import com.bdas_dva.backend.dto.OrderResponseDTO;
import com.bdas_dva.backend.Service.OrderService;
import com.bdas_dva.backend.Service.OrderService.OrderDetails;
import com.bdas_dva.backend.Service.UserService;
import com.bdas_dva.backend.Exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    // Создание нового заказа
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest, Authentication authentication) {
        try {
            String email = authentication.getName(); // Предполагается, что имя пользователя - это email
            Long userId = userService.getUserByEmail(email).getIdUser();
            // Предполагается, что пароль уже хеширован на фронтенде или здесь
            // Если необходимо, хешируйте пароль с помощью PasswordEncoder
            orderRequest.setPassword("hashed_password"); // Замените на реальный хешированный пароль
            OrderResponse response = orderService.createOrder(orderRequest, userId);
            return ResponseEntity.ok(response);
        } catch (SQLException e) {
            return ResponseEntity.status(500).body("Ошибка при создании заказа: " + e.getMessage());
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body("Пользователь не найден.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Ошибка: " + e.getMessage());
        }
    }

    // Получение заказов пользователя
    @GetMapping
    public ResponseEntity<?> getOrders(Authentication authentication) {
        try {
            String email = authentication.getName(); // Предполагается, что имя пользователя - это email
            Long userId = userService.getUserByEmail(email).getIdUser();
            List<OrderDetails> orders = orderService.getOrders(userId);

            // Преобразование данных для фронтенда
            List<OrderResponseDTO> response = orders.stream().map(order -> {
                OrderResponseDTO dto = new OrderResponseDTO();
                dto.setIdObjednavky(order.getIdObjednavky());
                dto.setDatum(order.getDatum());
                dto.setStav(order.getStav());
                dto.setMnozstvi(order.getMnozstvi());
                dto.setUlice(order.getUlice());
                dto.setPsc(order.getPsc());
                dto.setMesto(order.getMesto());
                dto.setCisloPopisne(order.getCisloPopisne());
                dto.setTelefon(order.getTelefon());
                dto.setEmail(order.getEmail());
                dto.setJmeno(order.getJmeno());
                dto.setPrijmeni(order.getPrijmeni());
                dto.setSuma(order.getSuma());
                dto.setTyp(order.getTyp());
                dto.setProducts(order.getProducts());
                return dto;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (SQLException e) {
            return ResponseEntity.status(500).body("Ошибка при получении заказов: " + e.getMessage());
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body("Пользователь не найден.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Ошибка: " + e.getMessage());
        }
    }
}
