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
                new ModuleResponse("dashboard", "Panel operativo", "/dashboard", "/api/v1/dashboard/summary"),
                new ModuleResponse("lotes", "Lotes e invernaderos", "/lotes", "/api/v1/lotes"),
                new ModuleResponse("camas", "Camas", "/camas", "/api/v1/camas"),
                new ModuleResponse("siembra", "Registro de siembra", "/siembra", "/api/v1/siembras"),
                new ModuleResponse("procesos", "Uniformización y formalización", "/procesos", "/api/v1/procesos"),
                new ModuleResponse("clasificacion", "Control de clasificación", "/clasificacion", "/api/v1/clasificaciones"),
                new ModuleResponse("despacho", "Seguimiento de despacho", "/despacho", "/api/v1/despachos"),
                new ModuleResponse("trazabilidad", "Trazabilidad por lote", "/trazabilidad", "/api/v1/reportes/trazabilidad"),
                new ModuleResponse("reportes", "Reportes operativos", "/reportes", "/api/v1/reportes/trazabilidad"),
                new ModuleResponse("usuarios", "Gestión de usuarios", "/usuarios", "/api/v1/usuarios")
        );
    }

    static List<EndpointResponse> endpoints() {
        return List.of(
                new EndpointResponse("GET", "/api/v1/auth/csrf", "Token CSRF para operaciones protegidas."),
                new EndpointResponse("POST", "/api/v1/auth/login", "Inicio de sesión del sistema."),
                new EndpointResponse("POST", "/api/v1/auth/logout", "Cierre de sesión del sistema."),
                new EndpointResponse("GET", "/api/v1/frontend/bootstrap", "Configuración inicial de la interfaz operativa."),
                new EndpointResponse("GET", "/api/v1/session/me", "Usuario autenticado y autoridades activas."),
                new EndpointResponse("PUT", "/api/v1/session/me", "Actualización del perfil del trabajador autenticado."),
                new EndpointResponse("PATCH", "/api/v1/session/me/password", "Cambio de contraseña del trabajador autenticado."),
                new EndpointResponse("GET", "/api/v1/dashboard/summary", "Resumen operativo del panel."),
                new EndpointResponse("GET", "/api/v1/catalogs/operations", "Catálogos necesarios para formularios del proceso productivo."),
                new EndpointResponse("GET", "/api/v1/lotes", "Listado de invernaderos."),
                new EndpointResponse("POST", "/api/v1/lotes", "Registro de invernaderos."),
                new EndpointResponse("PUT", "/api/v1/lotes/{id}", "Actualización de invernaderos."),
                new EndpointResponse("PATCH", "/api/v1/lotes/{id}/estado", "Cambio de estado de invernaderos."),
                new EndpointResponse("DELETE", "/api/v1/lotes/{id}", "Eliminación lógica de invernaderos."),
                new EndpointResponse("GET", "/api/v1/camas", "Listado de camas."),
                new EndpointResponse("POST", "/api/v1/camas", "Registro de camas."),
                new EndpointResponse("PUT", "/api/v1/camas/{id}", "Actualización de camas."),
                new EndpointResponse("PATCH", "/api/v1/camas/{id}/estado", "Cambio de estado de camas."),
                new EndpointResponse("GET", "/api/v1/siembras", "Listado de registros de siembra."),
                new EndpointResponse("POST", "/api/v1/siembras", "Registro de siembras."),
                new EndpointResponse("PUT", "/api/v1/siembras/{id}", "Actualización de siembras."),
                new EndpointResponse("PATCH", "/api/v1/siembras/{id}/estado", "Cambio de estado de siembras."),
                new EndpointResponse("DELETE", "/api/v1/siembras/{id}", "Eliminación de registros de siembra."),
                new EndpointResponse("GET", "/api/v1/procesos", "Resumen de uniformizaciones y formalizaciones."),
                new EndpointResponse("GET", "/api/v1/procesos/uniformizaciones", "Listado de uniformizaciones."),
                new EndpointResponse("POST", "/api/v1/procesos/uniformizaciones", "Registro de uniformizaciones."),
                new EndpointResponse("PUT", "/api/v1/procesos/uniformizaciones/{id}", "Actualización de uniformizaciones."),
                new EndpointResponse("PATCH", "/api/v1/procesos/uniformizaciones/{id}/estado", "Cambio de estado de uniformizaciones."),
                new EndpointResponse("GET", "/api/v1/procesos/formalizaciones", "Listado de formalizaciones."),
                new EndpointResponse("POST", "/api/v1/procesos/formalizaciones", "Registro de formalizaciones."),
                new EndpointResponse("PUT", "/api/v1/procesos/formalizaciones/{id}", "Actualización de formalizaciones."),
                new EndpointResponse("PATCH", "/api/v1/procesos/formalizaciones/{id}/estado", "Cambio de estado de formalizaciones."),
                new EndpointResponse("GET", "/api/v1/clasificaciones", "Listado de clasificaciones."),
                new EndpointResponse("POST", "/api/v1/clasificaciones", "Registro de clasificaciones."),
                new EndpointResponse("PUT", "/api/v1/clasificaciones/{id}", "Actualización de clasificaciones."),
                new EndpointResponse("PATCH", "/api/v1/clasificaciones/{id}/estado", "Cambio de estado de clasificaciones."),
                new EndpointResponse("GET", "/api/v1/despachos", "Listado de despachos."),
                new EndpointResponse("POST", "/api/v1/despachos", "Registro de despachos."),
                new EndpointResponse("PUT", "/api/v1/despachos/{id}", "Actualización de despachos."),
                new EndpointResponse("PATCH", "/api/v1/despachos/{id}/estado", "Cambio de estado de despachos."),
                new EndpointResponse("GET", "/api/v1/reportes/trazabilidad", "Consulta de trazabilidad por código, variedad o fecha."),
                new EndpointResponse("GET", "/api/v1/roles", "Listado de roles corporativos activos."),
                new EndpointResponse("GET", "/api/v1/usuarios", "Listado de usuarios para administración."),
                new EndpointResponse("POST", "/api/v1/usuarios", "Creación de usuarios corporativos @vlv.com."),
                new EndpointResponse("PUT", "/api/v1/usuarios/{id}", "Actualización de usuarios corporativos."),
                new EndpointResponse("PATCH", "/api/v1/usuarios/{id}/estado", "Activación o desactivación de usuarios.")
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
