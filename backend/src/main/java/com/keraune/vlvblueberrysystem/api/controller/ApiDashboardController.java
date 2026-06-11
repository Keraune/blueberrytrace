package com.keraune.vlvblueberrysystem.api.controller;

import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.ApiResponse;
import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.DashboardApiResponse;
import com.keraune.vlvblueberrysystem.service.DashboardMetricsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
public class ApiDashboardController {
    private final DashboardMetricsService dashboardMetricsService;

    public ApiDashboardController(DashboardMetricsService dashboardMetricsService) {
        this.dashboardMetricsService = dashboardMetricsService;
    }

    @GetMapping("/summary")
    public ApiResponse<DashboardApiResponse> summary() {
        return ApiResponse.ok("Resumen operativo cargado", new DashboardApiResponse(dashboardMetricsService.summary(), ApiModuleMetadata.modules()));
    }
}
