package com.bdas_dva.backend.Security;

public interface IUserDetailsService {
    UserDetails loadUserByUsername(String username);
}
