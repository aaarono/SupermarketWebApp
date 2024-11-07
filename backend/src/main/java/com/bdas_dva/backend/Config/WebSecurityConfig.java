package com.bdas_dva.backend.Config;

import com.bdas_dva.backend.Security.AuthEntryPointJwt;
import com.bdas_dva.backend.Security.AuthTokenFilter;
import com.bdas_dva.backend.Security.UserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

import java.util.Arrays;

@Configuration
@EnableMethodSecurity  // Включение методовой безопасности для аннотаций, таких как @PreAuthorize
public class WebSecurityConfig {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Разрешенные источники (домены)
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000")); // Замените на ваш адрес фронтенда

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

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Настройка CORS с использованием кастомного источника конфигурации
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Отключение CSRF, так как используем JWT
                .csrf(csrf -> csrf.disable())

                // Настройка обработчика исключений
                .exceptionHandling(exception ->
                        exception.authenticationEntryPoint(unauthorizedHandler))

                // Настройка сессионной политики как STATELESS
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Настройка авторизации запросов
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/", "/home").permitAll()
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                );

        // Добавление фильтра JWT перед фильтром UsernamePasswordAuthenticationFilter
        http.addFilterBefore(authenticationJwtTokenFilter(),
                UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
