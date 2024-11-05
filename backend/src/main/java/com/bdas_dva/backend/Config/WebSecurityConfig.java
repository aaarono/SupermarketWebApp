package com.bdas_dva.backend.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http
				.csrf().disable()
				.authorizeRequests()
				.antMatchers("/public/**").permitAll()  // Доступ к публичным ресурсам
				.antMatchers("/admin/**").hasRole("ROLE_Admin")
				.anyRequest().authenticated()          // Требуется аутентификация для всех остальных запросов
				.and()
				.sessionManagement()
				.maximumSessions(1)                     // Ограничение до одной сессии на пользователя
				.expiredUrl("/login?expired=true")      // URL для перенаправления после истечения сессии
				.and()
				.sessionFixation().migrateSession()     // Защита от фиксации сессии
				.and()
				.formLogin()
				.and()
				.logout()
				.logoutUrl("/logout")                   // URL для выхода из системы
				.logoutSuccessUrl("/login?logout=true") // URL после успешного выхода
				.invalidateHttpSession(true)            // Инвалидировать сессию
				.deleteCookies("JSESSIONID");           // Удалить cookie с идентификатором сессии
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}