package com.bdas_dva.backend.Security;

import com.bdas_dva.backend.Model.User;
import com.bdas_dva.backend.Service.UserService;
import com.bdas_dva.backend.Exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserService userService;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {
        try {
            User user = userService.getUserByEmail(email);
            return CustomUserDetails.build(user);
        } catch (ResourceNotFoundException e) {
            throw new UsernameNotFoundException("Пользователь не найден с email: " + email);
        }
    }
}
