package com.bdas_dva.backend.Util;

import com.bdas_dva.backend.Model.User;
import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String SECRET_KEY;

    @Value("${jwt.expirationMs}")
    private long EXPIRATION_TIME;

    // Генерация токена
    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail()) // Используем email как subject
                .claim("role", getRoleNameById(user.getRoleIdRole()))
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    private String getRoleNameById(Long roleId) {
        switch (roleId.intValue()) {
            case 1:
                return "ROLE_USER";
            case 2:
                return "ROLE_EMPLOYEE";
            case 3:
                return "ROLE_ADMIN";
            default:
                return "ROLE_USER"; // По умолчанию
        }
    }

    // Извлечение информации из токена
    public String getUserNameFromJwtToken(String token) {
        return parseClaims(token).getSubject();
    }

    public boolean validateToken(String authToken) {
        try {
            parseClaims(authToken);
            return true;
        } catch (SignatureException e) {
            // Неверная подпись
            logger.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            // Неверный формат токена
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            // Токен просрочен
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            // Неподдерживаемый токен
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            // Пустой токен
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }

        return false;
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }

    // Добавьте логгер
    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(JwtUtil.class);
}
