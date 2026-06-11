package com.keraune.vlvblueberrysystem.api.error;

import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Void> validation(MethodArgumentNotValidException exception) {
        String details = exception.getBindingResult().getFieldErrors().stream()
                .map(this::messageOf)
                .collect(Collectors.joining("; "));
        return new ApiResponse<>(false, details.isBlank() ? "Datos inválidos" : details, null);
    }

    @ExceptionHandler({IllegalArgumentException.class, IllegalStateException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Void> badRequest(RuntimeException exception) {
        return new ApiResponse<>(false, exception.getMessage(), null);
    }

    @ExceptionHandler({BadCredentialsException.class, AuthenticationException.class})
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ApiResponse<Void> unauthorized(RuntimeException exception) {
        return new ApiResponse<>(false, "Usuario, correo o contraseña incorrectos.", null);
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiResponse<Void> unexpected(Exception exception) {
        return new ApiResponse<>(false, "Error interno del servicio: " + exception.getClass().getSimpleName(), null);
    }

    private String messageOf(FieldError error) {
        return error.getField() + ": " + error.getDefaultMessage();
    }
}
