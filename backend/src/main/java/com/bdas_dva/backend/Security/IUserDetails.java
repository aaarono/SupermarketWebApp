package com.bdas_dva.backend.Security;

import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public interface IUserDetails {
    Collection<? extends GrantedAuthority> getAuthorities();
    String getPassword();
    String getUsername();
    boolean isAccountNonExpired();
    boolean isAccountNonLocked();
    boolean isCredentialsNonExpired();
    boolean isEnabled();
}
