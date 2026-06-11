package com.keraune.vlvblueberrysystem.api.controller;

import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.ApiResponse;
import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.AuthenticatedUserResponse;
import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.LoginRequest;
import com.keraune.vlvblueberrysystem.service.AccountService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class ApiAuthController {
    private final AuthenticationManager authenticationManager;
    private final AccountService accountService;

    public ApiAuthController(AuthenticationManager authenticationManager, AccountService accountService) {
        this.authenticationManager = authenticationManager;
        this.accountService = accountService;
    }

    public record CsrfResponse(String headerName, String parameterName, String token) {}

    @GetMapping("/csrf")
    public ApiResponse<CsrfResponse> csrf(CsrfToken csrfToken) {
        return ApiResponse.ok("Token CSRF disponible", new CsrfResponse(csrfToken.getHeaderName(), csrfToken.getParameterName(), csrfToken.getToken()));
    }

    @PostMapping("/login")
    public ApiResponse<AuthenticatedUserResponse> login(@Valid @RequestBody LoginRequest request, HttpServletRequest servletRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        servletRequest.getSession(true).setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, SecurityContextHolder.getContext());
        return ApiResponse.ok("Sesión iniciada", accountService.authenticatedUser(authentication));
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        new SecurityContextLogoutHandler().logout(request, response, authentication);
        return ApiResponse.ok("Sesión cerrada", null);
    }
}
