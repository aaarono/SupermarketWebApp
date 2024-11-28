package com.bdas_dva.backend.Controller;

import com.bdas_dva.backend.Model.User;
import com.bdas_dva.backend.Service.UserService;
import com.bdas_dva.backend.Util.JwtUtil;
import com.bdas_dva.backend.Exception.ResourceNotFoundException;
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
import java.util.Map;

import static com.bdas_dva.backend.Util.HashingUtil.checkPassword;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Точка для регистрации
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> userMap) {
        try {
            String jmeno = userMap.get("firstName");
            String prijmeni = userMap.get("lastName");
            String email = userMap.get("email");
            String telNumber = userMap.get("telNumber");
            String password = userMap.get("password");

            // Хеширование пароля
            String encodedPassword = passwordEncoder.encode(password);

            User user = new User();
            user.setJmeno(jmeno);
            user.setPrijmeni(prijmeni);
            user.setEmail(email);
            user.setTelNumber(telNumber);
            user.setPassword(encodedPassword);
            // Установите роль по умолчанию, например, ROLE_USER (roleIdRole = 1)
            user.setRoleIdRole(1L);

            userService.createUser(user);

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
}
