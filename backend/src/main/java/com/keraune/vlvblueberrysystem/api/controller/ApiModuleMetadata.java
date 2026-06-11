package com.keraune.vlvblueberrysystem.api.controller;

import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.EndpointResponse;
import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.ModuleResponse;

import java.util.List;

public final class ApiModuleMetadata {
    private ApiModuleMetadata() {}

    public static List<ModuleResponse> modules() {
        return List.of(
                new ModuleResponse("dashboard", "Dashboard", "/dashboard", "/api/v1/dashboard/summary"),
                new ModuleResponse("lotes", "Lotes", "/lotes", "/api/v1/lotes"),
                new ModuleResponse("camas", "Camas", "/camas", "/api/v1/camas"),
                new ModuleResponse("siembra", "Siembra", "/siembra", "/api/v1/siembras"),
                new ModuleResponse("procesos", "Procesos", "/procesos", "/api/v1/procesos"),
                new ModuleResponse("clasificacion", "Clasificación", "/clasificacion", "/api/v1/clasificaciones"),
                new ModuleResponse("despacho", "Despacho", "/despacho", "/api/v1/despachos"),
                new ModuleResponse("trazabilidad", "Trazabilidad", "/trazabilidad", "/api/v1/reportes/trazabilidad"),
                new ModuleResponse("reportes", "Reportes", "/reportes", "/api/v1/reportes/trazabilidad"),
                new ModuleResponse("usuarios", "Usuarios", "/usuarios", "/api/v1/usuarios")
        );
    }

    public static List<EndpointResponse> endpoints() {
        return List.of(
                new EndpointResponse("GET", "/api/v1/health", "Estado del backend"),
                new EndpointResponse("POST", "/api/v1/auth/login", "Inicio de sesión con usuario o correo"),
                new EndpointResponse("GET", "/api/v1/dashboard/summary", "Indicadores operativos"),
                new EndpointResponse("GET/POST/PUT/PATCH/DELETE", "/api/v1/lotes", "Gestión de lotes"),
                new EndpointResponse("GET/POST/PUT/PATCH", "/api/v1/camas", "Gestión de camas"),
                new EndpointResponse("GET/POST/PUT/PATCH/DELETE", "/api/v1/siembras", "Gestión de siembras"),
                new EndpointResponse("GET/POST/PUT/PATCH", "/api/v1/procesos", "Uniformización y formalización"),
                new EndpointResponse("GET/POST/PUT/PATCH", "/api/v1/clasificaciones", "Clasificación de plantas"),
                new EndpointResponse("GET/POST/PUT/PATCH", "/api/v1/despachos", "Despacho de plantas"),
                new EndpointResponse("GET", "/api/v1/reportes/trazabilidad", "Trazabilidad por lote"),
                new EndpointResponse("GET/POST/PUT/PATCH", "/api/v1/usuarios", "Usuarios y roles")
        );
    }
}
