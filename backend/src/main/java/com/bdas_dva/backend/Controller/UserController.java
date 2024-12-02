package com.bdas_dva.backend.Controller;

import com.bdas_dva.backend.Exception.ResourceNotFoundException;
import com.bdas_dva.backend.Model.User;
import com.bdas_dva.backend.Model.Zakaznik;
import com.bdas_dva.backend.Model.Address;
import com.bdas_dva.backend.Service.UserService;
import com.bdas_dva.backend.Service.ZakaznikService;
import com.bdas_dva.backend.Service.AddressService;
import com.bdas_dva.backend.Util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpHeaders;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Autowired
    private ZakaznikService zakaznikService;

    @Autowired
    private AddressService addressService;

    /**
     * Эндпоинт для получения данных о текущем пользователе и заказчике.
     * JWT токен должен быть передан в заголовке Authorization в формате "Bearer <token>".
     */
    @GetMapping("/customer")
    public ResponseEntity<?> getUserAndCustomer(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        try {
            // Проверяем наличие токена в заголовке
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Отсутствует или некорректный заголовок Authorization");
            }

            String token = authHeader.substring(7);

            // Валидируем токен
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(401).body("Недействительный или просроченный JWT токен");
            }

            // Извлекаем email пользователя из токена
            String email = jwtUtil.getUserNameFromJwtToken(token);
            // Получаем данные пользователя из базы данных
            User user = userService.getUserByEmail(email);
            // Получаем данные о заказчике по ID из пользователя
            System.out.println("user.getZakaznikIdZakazniku() = " + user.getZakaznikIdZakazniku());
            Zakaznik zakaznik = null;
            if (user.getZakaznikIdZakazniku() != null && user.getZakaznikIdZakazniku() != 0L) {
                zakaznik = zakaznikService.getZakaznikById(user.getZakaznikIdZakazniku());
            }
            Map<String, Object> response = new HashMap<>();
            response.put("user", user);
            response.put("customer", zakaznik);

            return ResponseEntity.ok(response);

        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Произошла ошибка при получении данных пользователя и заказчика");
        }
    }

    /**
     * Эндпоинт для получения адреса по ID заказчика.
     */
    @GetMapping("/customer/{id}/address")
    public ResponseEntity<?> getAddressByCustomerId(@PathVariable("id") Long customerId) {
        try {
            // Получаем заказчика по ID
            Zakaznik zakaznik = zakaznikService.getZakaznikById(customerId);

            // Проверяем, есть ли у заказчика адрес
            if (zakaznik.getAdresaIdAdresy() == null || zakaznik.getAdresaIdAdresy() == 0L) {
                return ResponseEntity.status(404).body("Адрес не найден для заказчика с ID " + customerId);
            }

            // Получаем адрес по ID
            Address address = addressService.getAddressById(zakaznik.getAdresaIdAdresy());

            return ResponseEntity.ok(address);

        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Произошла ошибка при получении адреса");
        }
    }
}
