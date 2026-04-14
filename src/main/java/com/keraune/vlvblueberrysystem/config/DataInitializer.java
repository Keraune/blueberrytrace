package com.keraune.vlvblueberrysystem.config;

import java.time.LocalDate;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.keraune.vlvblueberrysystem.entity.Cama;
import com.keraune.vlvblueberrysystem.entity.Lote;
import com.keraune.vlvblueberrysystem.entity.Role;
import com.keraune.vlvblueberrysystem.entity.User;
import com.keraune.vlvblueberrysystem.repository.CamaRepository;
import com.keraune.vlvblueberrysystem.repository.LoteRepository;
import com.keraune.vlvblueberrysystem.repository.RoleRepository;
import com.keraune.vlvblueberrysystem.repository.UserRepository;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initRolesAndAdmin(
            RoleRepository roleRepository,
            UserRepository userRepository,
            LoteRepository loteRepository,
            CamaRepository camaRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            createRoleIfNotExists(roleRepository, "ADMINISTRADOR", "Acceso total al sistema");
            createRoleIfNotExists(roleRepository, "SUPERVISOR", "Supervisa el proceso operativo");
            createRoleIfNotExists(roleRepository, "CONTABILIZADOR", "Registra conteos y cantidades");
            createRoleIfNotExists(roleRepository, "OPERARIO", "Registra actividades operativas");
            createRoleIfNotExists(roleRepository, "CONTROL_CALIDAD", "Valida calidad y despacho");

            if (userRepository.findByUsername("admin").isEmpty()) {
                Role adminRole = roleRepository
                        .findByNombre("ADMINISTRADOR")
                        .orElseThrow(() -> new IllegalStateException("No existe el rol ADMINISTRADOR"));

                User admin = new User();
                admin.setRol(adminRole);
                admin.setNombreCompleto("Administrador del Sistema");
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setEmail("admin@vlv.local");
                admin.setEstado(true);

                userRepository.save(admin);
            }

            User admin = userRepository
                    .findByUsername("admin")
                    .orElseThrow(() -> new IllegalStateException("No existe el usuario administrador."));

            if (loteRepository.count() == 0) {
                Lote loteUno = new Lote();
                loteUno.setCodigo("A1");
                loteUno.setDescripcion("Invernadero del sector A para frutales");
                loteUno.setCultivo("Arándano");
                loteUno.setVariedad("Biloxi");
                loteUno.setFechaRegistro(LocalDate.now());
                loteUno.setObservacion("Invernadero cubierto con filas de bandejas para propagación.");
                loteUno.setEstado("ACTIVO");
                loteUno.setUsuarioRegistro(admin);

                Lote loteDos = new Lote();
                loteDos.setCodigo("B1");
                loteDos.setDescripcion("Invernadero del sector B en evaluación operativa");
                loteDos.setCultivo("Vid");
                loteDos.setVariedad("Red Globe");
                loteDos.setFechaRegistro(LocalDate.now().minusDays(1));
                loteDos.setObservacion("Pendiente de validación de camas y distribución.");
                loteDos.setEstado("PENDIENTE");
                loteDos.setUsuarioRegistro(admin);

                loteRepository.save(loteUno);
                loteRepository.save(loteDos);
            }

            if (camaRepository.count() == 0) {
                Lote lotePrincipal = loteRepository
                        .findByCodigo("A1")
                        .orElseThrow(() -> new IllegalStateException("No existe el invernadero A1."));
                Lote loteSecundario = loteRepository
                        .findByCodigo("B1")
                        .orElseThrow(() -> new IllegalStateException("No existe el invernadero B1."));

                Cama camaUno = new Cama();
                camaUno.setCodigo("CAM-001");
                camaUno.setDescripcion("Cama sector 1");
                camaUno.setCapacidadReferencial(1200);
                camaUno.setEstado("ACTIVA");
                camaUno.setLote(lotePrincipal);
                camaUno.setUsuarioRegistro(admin);

                Cama camaDos = new Cama();
                camaDos.setCodigo("CAM-002");
                camaDos.setDescripcion("Cama sector 2");
                camaDos.setCapacidadReferencial(1000);
                camaDos.setEstado("MANTENIMIENTO");
                camaDos.setLote(loteSecundario);
                camaDos.setUsuarioRegistro(admin);

                camaRepository.save(camaUno);
                camaRepository.save(camaDos);
            }
        };
    }

    private void createRoleIfNotExists(
            RoleRepository roleRepository, String nombre, String descripcion) {
        if (roleRepository.findByNombre(nombre).isEmpty()) {
            Role role = new Role();
            role.setNombre(nombre);
            role.setDescripcion(descripcion);
            role.setEstado(true);
            roleRepository.save(role);
        }
    }
}
