package com.keraune.vlvblueberrysystem.api.error;

import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.ApiResponse;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = "com.keraune.vlvblueberrysystem.api")
public class ApiExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidation(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .map(this::formatFieldError)
                .collect(Collectors.joining(" "));
        if (message.isBlank()) {
            message = "Revisa los datos enviados antes de continuar.";
        }
        return ResponseEntity.badRequest().body(new ApiResponse<>(false, message, null));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> handleBusiness(IllegalArgumentException exception) {
        return ResponseEntity.badRequest().body(new ApiResponse<>(false, exception.getMessage(), null));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleUnexpected(Exception exception) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "No se pudo procesar la operación solicitada.", null));
    }

    private String formatFieldError(FieldError error) {
        return error.getDefaultMessage() == null ? error.getField() + " no es válido." : error.getDefaultMessage();
    }
}
