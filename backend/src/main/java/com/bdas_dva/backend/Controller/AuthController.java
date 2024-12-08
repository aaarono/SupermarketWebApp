package com.bdas_dva.backend.Controller;

import com.bdas_dva.backend.Model.User;
import com.bdas_dva.backend.Model.Zakaznik;
import com.bdas_dva.backend.Service.UserService;
import com.bdas_dva.backend.Service.ZakaznikService;
import com.bdas_dva.backend.Util.JwtUtil;
import com.bdas_dva.backend.Exception.ResourceNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private ZakaznikService zakaznikService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> userMap) {
        try {
            String jmeno = userMap.get("firstName");
            String prijmeni = userMap.get("lastName");
            String email = userMap.get("email");
            String telNumber = userMap.get("phone");
            String password = userMap.get("password");

            try {
                User existingUser = userService.getUserByEmail(email);
                return ResponseEntity.badRequest().body("Пользователь с таким email уже существует.");
            } catch (ResourceNotFoundException ex) {}

            // Хеширование пароля
            String encodedPassword = passwordEncoder.encode(password);

            // Создаем объект Zakaznik
            Zakaznik zakaznik = new Zakaznik();
            zakaznik.setTelefon(Long.parseLong(telNumber));

            // Создаем заказчика и получаем его ID
            Long zakaznikId = zakaznikService.createZakaznik(zakaznik);

            // Создаем объект User
            User user = new User();
            user.setJmeno(jmeno);
            user.setPrijmeni(prijmeni);
            user.setEmail(email);
            user.setPassword(encodedPassword);
            user.setRoleIdRole(1L);
            user.setZakaznikIdZakazniku(zakaznikId);

            userService.createUserZak(user);

            return ResponseEntity.ok("Пользователь успешно зарегистрирован.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ошибка регистрации: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> loginMap) {
        try {
            String email = loginMap.get("email");
            String password = loginMap.get("password");

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            User user = userService.getUserByEmail(email);

            String jwt = jwtUtil.generateToken(user);

            Map<String, String> response = new HashMap<>();
            response.put("token", jwt);

            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Неверный email или пароль.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ошибка логина: " + e.getMessage());
        }
    }

    // Пример защищенной точки, доступной только для администраторов
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> adminAccess() {
        return ResponseEntity.ok("Доступ только для администраторов.");
    }

    // Пример защищенной точки, доступной только для сотрудников
    @GetMapping("/employee")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<?> employeeAccess() {
        return ResponseEntity.ok("Доступ только для сотрудников.");
    }

    // Пример защищенной точки, доступной для всех аутентифицированных пользователей
    @GetMapping("/user")
    @PreAuthorize("hasRole('USER') or hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<?> userAccess() {
        return ResponseEntity.ok("Доступ для аутентифицированных пользователей.");
    }

    // Точка для поиска пользователей по фильтрам
    @PostMapping("/search")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public ResponseEntity<?> searchUsers(@RequestBody Map<String, Object> filters) {
        try {
            Long pIdUser = filters.containsKey("idUser") ? Long.valueOf(filters.get("idUser").toString()) : null;
            String pEmail = filters.containsKey("email") ? filters.get("email").toString() : null;
            Long pRoleIdRole = filters.containsKey("roleIdRole") ? Long.valueOf(filters.get("roleIdRole").toString()) : null;
            Integer pLimit = filters.containsKey("limit") ? Integer.valueOf(filters.get("limit").toString()) : null;

            List<User> users = userService.searchUsers(pIdUser, pEmail, pRoleIdRole, pLimit);

            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ошибка поиска: " + e.getMessage());
        }
    }

    @GetMapping("/role")
    public ResponseEntity<?> getUserRole(HttpServletRequest request) {
        String roleName = "ROLE_PUBLIC"; // Роль по умолчанию
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                if (jwtUtil.validateToken(token)) {
                    String email = jwtUtil.getUserNameFromJwtToken(token);
                    User user = userService.getUserWithRoleByEmail(email);
                    if (user != null && user.getRoleName() != null) {
                        roleName = user.getRoleName();
                    }
                    System.out.println("user.getRoleName() = " + user.getRoleName());
                }
            }
        } catch (Exception e) {
        }
        System.out.println("roleName.toLowerCase(Locale.ROOT).substring(5) = " + roleName.toLowerCase(Locale.ROOT).substring(5));

        Map<String, String> response = new HashMap<>();
        response.put("role", roleName.toLowerCase(Locale.ROOT).substring(5));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/simulate")
    public ResponseEntity<?> simulateUser(@RequestBody Map<String, Object> payload) {
        // Допустим, вы получаете userId из payload
        Long userId = Long.valueOf(payload.get("userId").toString());

        // Находим пользователя по userId (убедитесь что такой метод есть в UserService)
        User user = userService.getUserById(userId);

        if (user == null) {
            return ResponseEntity.badRequest().body("Пользователь не найден.");
        }

        // Генерируем токен для этого пользователя
        String simulationToken = jwtUtil.generateToken(user);

        Map<String, String> response = new HashMap<>();
        response.put("token", simulationToken);
        return ResponseEntity.ok(response);
    }
}
