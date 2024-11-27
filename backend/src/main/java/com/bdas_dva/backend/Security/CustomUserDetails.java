package com.bdas_dva.backend.Security;

import com.bdas_dva.backend.Model.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class CustomUserDetails implements UserDetails {

    private Long id;
    private String email;

    @JsonIgnore
    private String password;

    private GrantedAuthority authority;

    public CustomUserDetails(Long id, String email, String password, GrantedAuthority authority) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.authority = authority;
    }

    public static CustomUserDetails build(User user) {
        String roleName = getRoleNameById(user.getRoleIdRole());
        GrantedAuthority authority = new SimpleGrantedAuthority(roleName);

        return new CustomUserDetails(
                user.getIdUser(),
                user.getEmail(),
                user.getPassword(),
                authority);
    }

    private static String getRoleNameById(Long roleId) {
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

    public Long getId() {
        return id;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(authority);
    }

    @Override
    public String getPassword() {
        return password;
    }

    // Используем email как username
    @Override
    public String getUsername() {
        return email;
    }

    // Остальные методы из UserDetails
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
