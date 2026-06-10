package com.keraune.vlvblueberrysystem.api.controller;

import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.ApiResponse;
import java.time.OffsetDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ApiStatusController {

    private final Environment environment;
    private final String applicationName;

    public ApiStatusController(
            Environment environment,
            @Value("${spring.application.name:blueberrytrace-backend}") String applicationName
    ) {
        this.environment = environment;
        this.applicationName = applicationName;
    }

    @GetMapping({"/", "/api/v1/health"})
    public ApiResponse<BackendStatusResponse> status() {
        BackendStatusResponse response = new BackendStatusResponse(
                applicationName,
                "UP",
                "API-first backend ready for React/Vue clients.",
                OffsetDateTime.now(),
                List.of(environment.getActiveProfiles())
        );
        return ApiResponse.ok("Servicio BlueberryTrace disponible.", response);
    }

    public record BackendStatusResponse(
            String application,
            String status,
            String mode,
            OffsetDateTime timestamp,
            List<String> activeProfiles
    ) {
    }
}
