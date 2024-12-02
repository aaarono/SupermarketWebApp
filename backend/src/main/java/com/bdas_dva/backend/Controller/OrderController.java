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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    /**
     * Создание нового заказа
     * Доступно только для пользователей с ролями USER, EMPLOYEE или ADMIN
     */
    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest, Authentication authentication) {
        try {
            // Получаем email пользователя из Authentication
            String email = authentication.getName();
            Long userId = userService.getUserByEmail(email).getIdUser();

            // Здесь вы можете хешировать пароль, если это необходимо
            // Например, используя PasswordEncoder (предполагается, что он настроен)
            // String hashedPassword = passwordEncoder.encode(orderRequest.getPassword());
            // orderRequest.setPassword(hashedPassword);

            // Создаём заказ через OrderService
            OrderResponse response = orderService.createOrder(orderRequest, userId);

            // Формируем успешный ответ
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("order", response);
            responseBody.put("message", "Заказ успешно создан.");

            return ResponseEntity.ok(responseBody);
        } catch (SQLException e) {
            // Обработка SQL исключений
            return buildErrorResponse("Ошибка при создании заказа: " + e.getMessage(), 500);
        } catch (ResourceNotFoundException e) {
            // Обработка случая, когда пользователь не найден
            return buildErrorResponse("Пользователь не найден.", 404);
        } catch (Exception e) {
            // Общая обработка исключений
            return buildErrorResponse("Ошибка: " + e.getMessage(), 500);
        }
    }

    /**
     * Получение заказов текущего пользователя
     * Доступно только для пользователей с ролями USER, EMPLOYEE или ADMIN
     */
    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<?> getOrders(Authentication authentication) {
        try {
            // Получаем email пользователя из Authentication
            String email = authentication.getName();
            Long userId = userService.getUserByEmail(email).getIdUser();

            // Получаем список заказов через OrderService
            List<OrderDetails> orders = orderService.getOrders(userId);

            // Преобразуем заказы в DTO для фронтенда
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

            // Формируем успешный ответ
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("orders", response);

            return ResponseEntity.ok(responseBody);
        } catch (SQLException e) {
            // Обработка SQL исключений
            return buildErrorResponse("Ошибка при получении заказов: " + e.getMessage(), 500);
        } catch (ResourceNotFoundException e) {
            // Обработка случая, когда пользователь не найден
            return buildErrorResponse("Пользователь не найден.", 404);
        } catch (Exception e) {
            // Общая обработка исключений
            return buildErrorResponse("Ошибка: " + e.getMessage(), 500);
        }
    }

    /**
     * Вспомогательный метод для формирования структурированных сообщений об ошибках
     */
    private ResponseEntity<Map<String, String>> buildErrorResponse(String message, int status) {
        Map<String, String> errorBody = new HashMap<>();
        errorBody.put("error", message);
        return ResponseEntity.status(status).body(errorBody);
    }
}
