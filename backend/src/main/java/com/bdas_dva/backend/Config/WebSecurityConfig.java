package com.bdas_dva.backend.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())  // Отключаем CSRF
            .authorizeHttpRequests(authorizeRequests -> 
                authorizeRequests
                    .mvcMatchers("/public/**").permitAll()       // Доступ к публичным ресурсам
                    .mvcMatchers("/admin/**").hasRole("Admin")   // Используйте "Admin" без префикса "ROLE_"
                    .anyRequest().authenticated()                // Требуется аутентификация для всех остальных запросов
            )
            .sessionManagement(sessionManagement ->
                sessionManagement
                    .maximumSessions(1)                           // Ограничение до одной сессии на пользователя
                    .expiredUrl("/login?expired=true")            // URL для перенаправления после истечения сессии
            )
            .formLogin(form -> form
                .loginPage("/login")                              // Указываем страницу логина, если нужно
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/logout")                             // URL для выхода из системы
                .logoutSuccessUrl("/login?logout=true")           // URL после успешного выхода
                .invalidateHttpSession(true)                      // Инвалидировать сессию
                .deleteCookies("JSESSIONID")                      // Удалить cookie с идентификатором сессии
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
