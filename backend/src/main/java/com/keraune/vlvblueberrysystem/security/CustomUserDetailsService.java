package com.keraune.vlvblueberrysystem.security;

import com.keraune.vlvblueberrysystem.entity.User;
import com.keraune.vlvblueberrysystem.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        String identifier = LoginIdentifier.normalize(usernameOrEmail);
        User user = (LoginIdentifier.isEmail(identifier)
                ? userRepository.findByEmailIgnoreCase(identifier)
                : userRepository.findByUsernameIgnoreCase(identifier))
                .orElseThrow(() -> new UsernameNotFoundException("Usuario o correo no encontrado"));

        String roleName = user.getRole() != null ? user.getRole().getNombre() : "OPERARIO";
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .disabled(!Boolean.TRUE.equals(user.getEstado()))
                .authorities(List.of(new SimpleGrantedAuthority("ROLE_" + roleName)))
                .build();
    }
}
