package com.keraune.vlvblueberrysystem.api.controller;

import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.ApiResponse;
import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.AuthenticatedUserResponse;
import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.PasswordChangePayload;
import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.ProfileUpdatePayload;
import com.keraune.vlvblueberrysystem.entity.User;
import com.keraune.vlvblueberrysystem.repository.UserRepository;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import java.util.Locale;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/session")
public class ApiSessionController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ApiSessionController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/me")
    public ApiResponse<AuthenticatedUserResponse> authenticatedUser(Principal principal, Authentication authentication) {
        return ApiResponse.ok(toAuthenticatedUser(userByPrincipal(principal), authentication));
    }

    @PutMapping("/me")
    public ApiResponse<AuthenticatedUserResponse> updateProfile(
            Principal principal,
            Authentication authentication,
            @Valid @RequestBody ProfileUpdatePayload payload
    ) {
        User user = userByPrincipal(principal);
        String email = normalizeEmail(payload.email());

        userRepository.findByEmailIgnoreCase(email)
                .filter(existing -> !existing.getId().equals(user.getId()))
                .ifPresent(existing -> {
                    throw new IllegalArgumentException("Ya existe otro usuario con ese correo empresarial.");
                });

        user.setNombreCompleto(payload.nombreCompleto().trim());
        user.setEmail(email);
        user.setCargo(cleanNullable(payload.cargo()));
        user.setTelefono(cleanNullable(payload.telefono()));
        user.setAvatarColor(normalizeAvatarColor(payload.avatarColor(), user.getAvatarColor()));
        userRepository.save(user);

        return ApiResponse.ok("Perfil actualizado correctamente.", toAuthenticatedUser(user, authentication));
    }

    @PatchMapping("/me/password")
    public ApiResponse<Void> changePassword(Principal principal, @Valid @RequestBody PasswordChangePayload payload) {
        User user = userByPrincipal(principal);
        if (!passwordEncoder.matches(payload.currentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("La contraseña actual no es correcta.");
        }
        if (passwordEncoder.matches(payload.newPassword(), user.getPassword())) {
            throw new IllegalArgumentException("La nueva contraseña debe ser diferente a la actual.");
        }
        user.setPassword(passwordEncoder.encode(payload.newPassword().trim()));
        userRepository.save(user);
        return ApiResponse.ok("Contraseña actualizada correctamente.", null);
    }

    private User userByPrincipal(Principal principal) {
        return userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new IllegalArgumentException("No se encontró el usuario autenticado."));
    }

    private AuthenticatedUserResponse toAuthenticatedUser(User user, Authentication authentication) {
        List<String> authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        return new AuthenticatedUserResponse(
                user.getUsername(),
                user.getNombreCompleto(),
                user.getEmail(),
                user.getCargo(),
                user.getTelefono(),
                user.getAvatarColor(),
                user.getRol() == null ? null : user.getRol().getNombre(),
                authorities
        );
    }

    private String normalizeEmail(String email) {
        String value = email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
        if (!value.endsWith("@vlv.com")) {
            throw new IllegalArgumentException("El correo debe pertenecer al dominio corporativo @vlv.com.");
        }
        return value;
    }

    private String cleanNullable(String value) {
        if (value == null || value.trim().isBlank()) {
            return null;
        }
        return value.trim();
    }

    private String normalizeAvatarColor(String requestedColor, String currentColor) {
        String value = requestedColor == null ? "" : requestedColor.trim();
        if (value.isBlank()) {
            return currentColor == null || currentColor.isBlank() ? "emerald" : currentColor;
        }
        if (!value.matches("^[a-zA-Z0-9_-]{3,24}$")) {
            throw new IllegalArgumentException("El color del avatar no es válido.");
        }
        return value;
    }
}
