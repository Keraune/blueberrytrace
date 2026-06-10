package com.keraune.vlvblueberrysystem.api.controller;

import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.EndpointResponse;
import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.ModuleResponse;
import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.PaletteResponse;
import java.util.List;

final class ApiModuleMetadata {

    private ApiModuleMetadata() {
    }

    static List<ModuleResponse> modules() {
        return List.of(
                new ModuleResponse("dashboard", "Dashboard", "/dashboard", "/api/v1/dashboard/summary"),
                new ModuleResponse("lotes", "Lotes e Invernaderos", "/lotes", "/api/v1/lotes"),
                new ModuleResponse("camas", "Camas", "/camas", "/api/v1/camas"),
                new ModuleResponse("siembra", "Registro de Siembra", "/siembra", "/api/v1/siembras"),
                new ModuleResponse("procesos", "Uniformización y Formalización", "/procesos", "/api/v1/procesos"),
                new ModuleResponse("clasificacion", "Clasificación", "/clasificacion", "/api/v1/clasificaciones"),
                new ModuleResponse("despacho", "Despacho", "/despacho", "/api/v1/despachos"),
                new ModuleResponse("reportes", "Reportes", "/reportes", "/api/v1/reportes/trazabilidad"),
                new ModuleResponse("usuarios", "Usuarios", "/usuarios", "/api/v1/usuarios")
        );
    }

    static List<EndpointResponse> endpoints() {
        return List.of(
                new EndpointResponse("GET", "/api/v1/auth/csrf", "Token CSRF para clientes externos autorizados."),
                new EndpointResponse("POST", "/api/v1/auth/login", "Inicio de sesión JSON para React/Vue."),
                new EndpointResponse("POST", "/api/v1/auth/logout", "Cierre de sesión JSON para React/Vue."),
                new EndpointResponse("GET", "/api/v1/frontend/bootstrap", "Configuración inicial para clientes React o Vue."),
                new EndpointResponse("GET", "/api/v1/session/me", "Usuario autenticado y autoridades activas."),
                new EndpointResponse("GET", "/api/v1/dashboard/summary", "Resumen operativo del panel."),
                new EndpointResponse("GET", "/api/v1/catalogs/operations", "Catálogos necesarios para formularios del proceso productivo."),
                new EndpointResponse("GET", "/api/v1/lotes", "Listado de invernaderos."),
                new EndpointResponse("POST", "/api/v1/lotes", "Registro de invernaderos desde clientes React/Vue."),
                new EndpointResponse("PUT", "/api/v1/lotes/{id}", "Actualización de invernaderos desde clientes React/Vue."),
                new EndpointResponse("PATCH", "/api/v1/lotes/{id}/estado", "Cambio de estado de invernaderos."),
                new EndpointResponse("DELETE", "/api/v1/lotes/{id}", "Eliminación lógica de invernaderos."),
                new EndpointResponse("GET", "/api/v1/camas", "Listado de camas."),
                new EndpointResponse("POST", "/api/v1/camas", "Registro de camas desde clientes React/Vue."),
                new EndpointResponse("PUT", "/api/v1/camas/{id}", "Actualización de camas desde clientes React/Vue."),
                new EndpointResponse("PATCH", "/api/v1/camas/{id}/estado", "Cambio de estado de camas."),
                new EndpointResponse("GET", "/api/v1/siembras", "Listado de registros de siembra."),
                new EndpointResponse("POST", "/api/v1/siembras", "Registro de siembras desde clientes React/Vue."),
                new EndpointResponse("PATCH", "/api/v1/siembras/{id}/estado", "Cambio de estado de siembras."),
                new EndpointResponse("GET", "/api/v1/procesos", "Resumen de uniformizaciones y formalizaciones."),
                new EndpointResponse("GET", "/api/v1/procesos/uniformizaciones", "Listado de uniformizaciones."),
                new EndpointResponse("POST", "/api/v1/procesos/uniformizaciones", "Registro de uniformizaciones desde clientes React/Vue."),
                new EndpointResponse("PATCH", "/api/v1/procesos/uniformizaciones/{id}/estado", "Cambio de estado de uniformizaciones."),
                new EndpointResponse("GET", "/api/v1/procesos/formalizaciones", "Listado de formalizaciones."),
                new EndpointResponse("POST", "/api/v1/procesos/formalizaciones", "Registro de formalizaciones desde clientes React/Vue."),
                new EndpointResponse("PATCH", "/api/v1/procesos/formalizaciones/{id}/estado", "Cambio de estado de formalizaciones."),
                new EndpointResponse("GET", "/api/v1/clasificaciones", "Listado de clasificaciones."),
                new EndpointResponse("POST", "/api/v1/clasificaciones", "Registro de clasificaciones desde clientes React/Vue."),
                new EndpointResponse("PATCH", "/api/v1/clasificaciones/{id}/estado", "Cambio de estado de clasificaciones."),
                new EndpointResponse("GET", "/api/v1/despachos", "Listado de despachos."),
                new EndpointResponse("POST", "/api/v1/despachos", "Registro de despachos desde clientes React/Vue."),
                new EndpointResponse("PATCH", "/api/v1/despachos/{id}/estado", "Cambio de estado de despachos."),
                new EndpointResponse("GET", "/api/v1/reportes/trazabilidad", "Consulta de trazabilidad por código, variedad o fecha."),
                new EndpointResponse("GET", "/api/v1/usuarios", "Listado de usuarios para administración.")
        );
    }

    static PaletteResponse palette() {
        return new PaletteResponse(
                "#082817",
                "#1f7a43",
                "#0ea5e9",
                "#7c3aed",
                "#22c55e",
                "#f59e0b",
                "#ffffff",
                "#eef6f0"
        );
    }
}
