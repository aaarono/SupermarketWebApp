package com.bdas_dva.backend.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.Customizer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity  // Включение методовой безопасности для аннотаций, таких как @PreAuthorize
public class WebSecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Включаем CORS с использованием кастомного источника конфигурации
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Отключаем CSRF, если не требуется
                .csrf(csrf -> csrf.disable())

                // Настройка авторизации запросов
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/home").permitAll()
                        .requestMatchers("/api/**").permitAll()     // Публичные ресурсы /TODO ОТДЕЛИТЬ ПОТОМ ЭТУ ХУЙНЮ/
                        .requestMatchers("/admin/**").hasRole("ADMIN")   // Доступ только для ADMIN
                        .anyRequest().authenticated()                    // Все остальные запросы требуют аутентификации
                )

                // Настройка управления сессиями
                .sessionManagement(session -> session
                        .maximumSessions(1)                           // Ограничение до одной сессии на пользователя
                        .expiredUrl("/login?expired=true")            // URL для перенаправления после истечения сессии
                )

                // Настройка формы логина
                .formLogin(form -> form
                        .loginPage("/login")                              // Указываем страницу логина
                        .permitAll()
                )

                // Настройка выхода из системы
                .logout(logout -> logout
                        .logoutUrl("/logout")                             // URL для выхода из системы
                        .logoutSuccessUrl("/login?logout=true")           // URL после успешного выхода
                        .invalidateHttpSession(true)                      // Инвалидировать сессию
                        .deleteCookies("JSESSIONID")                      // Удалить cookie с идентификатором сессии
                );

        return http.build();
    }

    // Бин для кодирования паролей
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Глобальная конфигурация CORS
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Разрешенные источники (домены)
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));

        // Разрешенные методы
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Разрешенные заголовки
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));

        // Разрешить передачу учетных данных (cookies, authorization headers и т.д.)
        configuration.setAllowCredentials(true);

        // Разрешенные заголовки для ответа (опционально)
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        // Применить конфигурацию ко всем эндпоинтам
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
