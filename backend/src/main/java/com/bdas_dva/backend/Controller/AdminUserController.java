package com.bdas_dva.backend.Controller;

import com.bdas_dva.backend.Exception.ResourceNotFoundException;
import com.bdas_dva.backend.Model.User;
import com.bdas_dva.backend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@RequestMapping("/api/users") // Маршрут для административных операций
@CrossOrigin(origins = "http://localhost:3000") // Добавьте эту строку
public class AdminUserController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Получение всех пользователей через прямой SQL-запрос
     */
    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userService.getAllUsersDirect();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            // Логирование ошибки (опционально)
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Произошла ошибка при получении списка пользователей");
        }
    }

    /**
     * Получение пользователя по ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable("id") Long idUser) {
        try {
            User user = userService.getUserById(idUser);
            return ResponseEntity.ok(user);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch(Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Произошла ошибка при получении пользователя");
        }
    }

    /**
     * Создание нового пользователя
     */
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try {
            // Валидация входных данных
            if (user.getJmeno() == null || user.getJmeno().isEmpty() ||
                    user.getPrijmeni() == null || user.getPrijmeni().isEmpty() ||
                    user.getEmail() == null || user.getEmail().isEmpty() ||
                    user.getPassword() == null || user.getPassword().isEmpty() ||
                    user.getRoleIdRole() == null ||
                    user.getZakaznikIdZakazniku() == null ||
                    user.getZamnestnanecIdZamnestnance() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Некорректные входные данные");
            }

            // Хеширование пароля перед сохранением
            String rawPassword = user.getPassword();
            String encodedPassword = passwordEncoder.encode(rawPassword);
            user.setPassword(encodedPassword);

            userService.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Пользователь создан успешно");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Произошла ошибка при создании пользователя");
        }
    }

    /**
     * Обновление существующего пользователя
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable("id") Long idUser, @RequestBody User userDetails) {
        try {
            User existingUser = userService.getUserById(idUser);

            // Обновляем поля пользователя
            existingUser.setJmeno(userDetails.getJmeno());
            existingUser.setPrijmeni(userDetails.getPrijmeni());
            existingUser.setEmail(userDetails.getEmail());

            // Если пароль не пустой, хешируем его и обновляем
            if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
                String encodedPassword = passwordEncoder.encode(userDetails.getPassword());
                existingUser.setPassword(encodedPassword);
            }

            existingUser.setRoleIdRole(userDetails.getRoleIdRole());
            existingUser.setZakaznikIdZakazniku(userDetails.getZakaznikIdZakazniku());
            existingUser.setZamnestnanecIdZamnestnance(userDetails.getZamnestnanecIdZamnestnance());

            userService.updateUser(existingUser);
            return ResponseEntity.ok("Пользователь обновлен успешно");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch(Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Произошла ошибка при обновлении пользователя");
        }
    }

    /**
     * Удаление пользователя
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable("id") Long idUser) {
        try {
            userService.deleteUser(idUser);
            return ResponseEntity.ok("Пользователь удален успешно");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch(Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Произошла ошибка при удалении пользователя");
        }
    }
}
