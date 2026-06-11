package com.keraune.vlvblueberrysystem.config;

import com.keraune.vlvblueberrysystem.entity.Role;
import com.keraune.vlvblueberrysystem.entity.User;
import com.keraune.vlvblueberrysystem.repository.RoleRepository;
import com.keraune.vlvblueberrysystem.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.LinkedHashMap;
import java.util.Map;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner seedSecurityData(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            Map<String, String> roles = new LinkedHashMap<>();
            roles.put("ADMINISTRADOR", "Acceso total al sistema");
            roles.put("SUPERVISOR", "Supervisa el proceso operativo");
            roles.put("CONTABILIZADOR", "Registra conteos y cantidades");
            roles.put("OPERARIO", "Registra actividades operativas");
            roles.put("CONTROL_CALIDAD", "Valida calidad y despacho");

            for (Map.Entry<String, String> entry : roles.entrySet()) {
                roleRepository.findByNombreIgnoreCase(entry.getKey()).orElseGet(() -> {
                    Role role = new Role();
                    role.setNombre(entry.getKey());
                    role.setDescripcion(entry.getValue());
                    role.setEstado(true);
                    return roleRepository.save(role);
                });
            }

            Role adminRole = roleRepository.findByNombreIgnoreCase("ADMINISTRADOR").orElseThrow();
            userRepository.findByUsernameIgnoreCase("admin").ifPresentOrElse(admin -> {
                if (admin.getEmail() == null || admin.getEmail().isBlank()) {
                    admin.setEmail("admin@vlv.com");
                }
                if (admin.getRole() == null) {
                    admin.setRole(adminRole);
                }
                if (admin.getPassword() == null || "admin123".equals(admin.getPassword())) {
                    admin.setPassword(passwordEncoder.encode("admin123"));
                }
                admin.setEstado(true);
                userRepository.save(admin);
            }, () -> {
                User admin = new User();
                admin.setUsername("admin");
                admin.setNombreCompleto("Administrador BlueberryTrace");
                admin.setEmail("admin@vlv.com");
                admin.setCargo("Administración del sistema");
                admin.setAvatarColor("emerald");
                admin.setEstado(true);
                admin.setRole(adminRole);
                admin.setPassword(passwordEncoder.encode("admin123"));
                userRepository.save(admin);
            });
        };
    }
}
