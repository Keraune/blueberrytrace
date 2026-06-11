package com.keraune.vlvblueberrysystem.service;

import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.AuthenticatedUserResponse;
import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.PasswordChangePayload;
import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.ProfileUpdatePayload;
import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.UserFormPayload;
import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.UserReferenceResponse;
import com.keraune.vlvblueberrysystem.api.mapper.ApiRecordMapper;
import com.keraune.vlvblueberrysystem.entity.Role;
import com.keraune.vlvblueberrysystem.entity.User;
import com.keraune.vlvblueberrysystem.repository.RoleRepository;
import com.keraune.vlvblueberrysystem.repository.UserRepository;
import com.keraune.vlvblueberrysystem.security.LoginIdentifier;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AccountService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final ApiRecordMapper mapper;

    public AccountService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder, ApiRecordMapper mapper) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public User currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("Sesión no autenticada");
        }
        return userRepository.findByUsernameIgnoreCase(authentication.getName())
                .orElseThrow(() -> new IllegalStateException("Usuario autenticado no existe en MySQL"));
    }

    @Transactional(readOnly = true)
    public AuthenticatedUserResponse currentUserResponse() {
        return authenticatedUser(currentUser());
    }

    public AuthenticatedUserResponse authenticatedUser(User user) {
        List<String> authorities = List.of("ROLE_" + (user.getRole() != null ? user.getRole().getNombre() : "OPERARIO"));
        return new AuthenticatedUserResponse(user.getUsername(), user.getNombreCompleto(), user.getEmail(), user.getCargo(),
                user.getTelefono(), user.getAvatarColor(), user.getRole() != null ? user.getRole().getNombre() : null, authorities);
    }

    public AuthenticatedUserResponse authenticatedUser(Authentication authentication) {
        User user = userRepository.findByUsernameIgnoreCase(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("Usuario autenticado no encontrado"));
        List<String> authorities = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();
        return new AuthenticatedUserResponse(user.getUsername(), user.getNombreCompleto(), user.getEmail(), user.getCargo(),
                user.getTelefono(), user.getAvatarColor(), user.getRole() != null ? user.getRole().getNombre() : null, authorities);
    }

    @Transactional(readOnly = true)
    public List<UserReferenceResponse> listUsers() {
        return userRepository.findAllByOrderByNombreCompletoAsc().stream().map(mapper::user).toList();
    }

    @Transactional(readOnly = true)
    public List<String> activeRoles() {
        return roleRepository.findByEstadoTrueOrderByNombreAsc().stream().map(Role::getNombre).toList();
    }

    public List<UserReferenceResponse> createUser(UserFormPayload payload) {
        String username = LoginIdentifier.normalize(payload.username());
        String email = LoginIdentifier.normalize(payload.email());
        if (userRepository.existsByUsernameIgnoreCase(username)) {
            throw new IllegalArgumentException("Ya existe un usuario con ese nombre de usuario.");
        }
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException("Ya existe un usuario con ese correo.");
        }
        User user = new User();
        applyUserPayload(user, payload, true);
        user.setUsername(username);
        user.setEmail(email);
        userRepository.save(user);
        return listUsers();
    }

    public List<UserReferenceResponse> updateUser(Long id, UserFormPayload payload) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        String username = LoginIdentifier.normalize(payload.username());
        String email = LoginIdentifier.normalize(payload.email());
        userRepository.findByUsernameIgnoreCase(username).filter(other -> !other.getId().equals(id)).ifPresent(other -> {
            throw new IllegalArgumentException("Ya existe otro usuario con ese nombre de usuario.");
        });
        userRepository.findByEmailIgnoreCase(email).filter(other -> !other.getId().equals(id)).ifPresent(other -> {
            throw new IllegalArgumentException("Ya existe otro usuario con ese correo.");
        });
        user.setUsername(username);
        user.setEmail(email);
        applyUserPayload(user, payload, false);
        return listUsers();
    }

    public List<UserReferenceResponse> toggleUserStatus(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        user.setEstado(!Boolean.TRUE.equals(user.getEstado()));
        return listUsers();
    }

    public AuthenticatedUserResponse updateProfile(ProfileUpdatePayload payload) {
        User user = currentUser();
        String email = LoginIdentifier.normalize(payload.email());
        userRepository.findByEmailIgnoreCase(email).filter(other -> !other.getId().equals(user.getId())).ifPresent(other -> {
            throw new IllegalArgumentException("El correo ya está asociado a otra cuenta.");
        });
        user.setNombreCompleto(payload.nombreCompleto().trim());
        user.setEmail(email);
        user.setCargo(trimToNull(payload.cargo()));
        user.setTelefono(trimToNull(payload.telefono()));
        user.setAvatarColor(trimToDefault(payload.avatarColor(), "emerald"));
        return authenticatedUser(user);
    }

    public void changePassword(PasswordChangePayload payload) {
        User user = currentUser();
        if (!passwordEncoder.matches(payload.currentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("La contraseña actual no coincide.");
        }
        user.setPassword(passwordEncoder.encode(payload.newPassword()));
    }

    private void applyUserPayload(User user, UserFormPayload payload, boolean creating) {
        Role role = roleRepository.findByNombreIgnoreCase(payload.rol())
                .orElseThrow(() -> new IllegalArgumentException("Rol no encontrado: " + payload.rol()));
        user.setRole(role);
        user.setNombreCompleto(payload.nombreCompleto().trim());
        user.setCargo(trimToNull(payload.cargo()));
        user.setTelefono(trimToNull(payload.telefono()));
        user.setAvatarColor(trimToDefault(payload.avatarColor(), "emerald"));
        user.setEstado(payload.activo());
        if (creating || (payload.password() != null && !payload.password().isBlank())) {
            user.setPassword(passwordEncoder.encode(payload.password()));
        }
    }

    private String trimToNull(String value) {
        if (value == null || value.isBlank()) return null;
        return value.trim();
    }

    private String trimToDefault(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value.trim();
    }
}
