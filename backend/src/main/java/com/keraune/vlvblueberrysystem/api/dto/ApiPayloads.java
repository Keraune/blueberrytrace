package com.keraune.vlvblueberrysystem.api.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public final class ApiPayloads {
    private ApiPayloads() {}

    public record ApiResponse<T>(boolean success, String message, T data) {
        public static <T> ApiResponse<T> ok(String message, T data) {
            return new ApiResponse<>(true, message, data);
        }
    }

    public record ListResponse<T>(long total, List<T> items) {}

    public record ReferenceResponse(Long id, String codigo, String descripcion) {}

    public record UserReferenceResponse(
            Long id,
            String username,
            String nombreCompleto,
            String email,
            String cargo,
            String telefono,
            String avatarColor,
            String avatarImage,
            String rol,
            boolean activo,
            LocalDateTime fechaCreacion,
            LocalDateTime fechaActualizacion
    ) {}

    public record AuthenticatedUserResponse(
            String username,
            String nombreCompleto,
            String email,
            String cargo,
            String telefono,
            String avatarColor,
            String avatarImage,
            String rol,
            List<String> authorities
    ) {}

    public record UserFormPayload(
            @NotBlank @Size(max = 50) String username,
            @NotBlank @Size(max = 150) String nombreCompleto,
            @NotBlank @Email @Size(max = 120) String email,
            @Size(max = 90) String cargo,
            @Size(max = 30) String telefono,
            @Size(max = 30) String avatarColor,
            @NotBlank @Size(max = 50) String rol,
            @Size(min = 8, max = 120) String password,
            boolean activo
    ) {}

    public record ProfileUpdatePayload(
            @NotBlank @Size(max = 150) String nombreCompleto,
            @NotBlank @Email @Size(max = 120) String email,
            @Size(max = 90) String cargo,
            @Size(max = 30) String telefono,
            @Size(max = 30) String avatarColor,
            @Size(max = 1_500_000) String avatarImage
    ) {}

    public record PasswordChangePayload(
            @NotBlank String currentPassword,
            @NotBlank @Size(min = 8, max = 120) String newPassword
    ) {}

    public record ModuleResponse(String key, String label, String mvcPath, String apiPath) {}

    public record EndpointResponse(String method, String path, String description) {}

    public record PaletteResponse(
            String darkGreen,
            String primaryGreen,
            String blueberryBlue,
            String blueberryPurple,
            String lime,
            String orange,
            String surface,
            String background
    ) {}

    public record FrontendBootstrapResponse(
            String appName,
            String apiVersion,
            String strategy,
            List<String> supportedFrontends,
            List<EndpointResponse> endpoints,
            List<ModuleResponse> modules,
            PaletteResponse palette
    ) {}

    public record DashboardApiResponse(
            com.keraune.vlvblueberrysystem.dto.DashboardSummary summary,
            List<ModuleResponse> modules
    ) {}

    public record LoteResponse(
            Long id,
            String codigo,
            String descripcion,
            String cultivo,
            String variedad,
            LocalDate fechaRegistro,
            String observacion,
            String estado,
            UserReferenceResponse usuarioRegistro,
            LocalDateTime fechaCreacion,
            LocalDateTime fechaActualizacion
    ) {}

    public record CamaResponse(
            Long id,
            String codigo,
            String descripcion,
            Integer capacidadReferencial,
            String estado,
            ReferenceResponse lote,
            UserReferenceResponse usuarioRegistro,
            LocalDateTime fechaCreacion,
            LocalDateTime fechaActualizacion
    ) {}

    public record SiembraResponse(
            Long id,
            ReferenceResponse lote,
            ReferenceResponse cama,
            LocalDate fechaSiembra,
            Integer cantidadRegistrada,
            String observacion,
            String estado,
            UserReferenceResponse usuarioRegistro,
            LocalDateTime fechaCreacion,
            LocalDateTime fechaActualizacion
    ) {}

    public record UniformizacionResponse(
            Long id,
            ReferenceResponse lote,
            ReferenceResponse cama,
            LocalDate fechaUniformizacion,
            String criterio,
            Integer cantidadInicial,
            Integer cantidadUniformizada,
            String observacion,
            String estado,
            UserReferenceResponse usuarioRegistro,
            LocalDateTime fechaCreacion,
            LocalDateTime fechaActualizacion
    ) {}

    public record FormalizacionResponse(
            Long id,
            ReferenceResponse lote,
            ReferenceResponse cama,
            LocalDate fechaFormalizacion,
            String detalle,
            Integer cantidadBandejas,
            Integer cantidadPlantas,
            String observacion,
            String estado,
            UserReferenceResponse usuarioRegistro,
            LocalDateTime fechaCreacion,
            LocalDateTime fechaActualizacion
    ) {}

    public record ProcesoOperativoResponse(
            ListResponse<UniformizacionResponse> uniformizaciones,
            ListResponse<FormalizacionResponse> formalizaciones
    ) {}

    public record ClasificacionResponse(
            Long id,
            ReferenceResponse lote,
            ReferenceResponse cama,
            LocalDate fechaClasificacion,
            String estadoPlanta,
            String tamano,
            String condicion,
            Integer cantidad,
            String observacion,
            String estado,
            UserReferenceResponse usuarioRegistro,
            LocalDateTime fechaCreacion,
            LocalDateTime fechaActualizacion
    ) {}

    public record DespachoResponse(
            Long id,
            ReferenceResponse lote,
            LocalDate fechaDespacho,
            String modalidad,
            Integer cantidadDespachada,
            String destino,
            String guiaRemision,
            String validacionCalidad,
            String observacion,
            String estado,
            UserReferenceResponse usuarioRegistro,
            LocalDateTime fechaCreacion,
            LocalDateTime fechaActualizacion
    ) {}

    public record TrazabilidadResponse(
            Long id,
            ReferenceResponse lote,
            long camas,
            long siembras,
            long plantasSembradas,
            long uniformizaciones,
            long formalizaciones,
            long clasificaciones,
            long despachos,
            long plantasDespachadas,
            String ultimoEvento
    ) {}

    public record CatalogResponse(
            List<ReferenceResponse> lotes,
            List<ReferenceResponse> camas,
            List<String> roles,
            List<String> estadosLote,
            List<String> estadosCama,
            List<String> estadosOperativos,
            List<String> estadosClasificacion,
            List<String> estadosDespacho,
            List<String> modalidadesDespacho,
            List<String> validacionesCalidad
    ) {}

    public record LoginRequest(
            @JsonAlias({"identifier", "email"})
            @NotBlank String username,
            @NotBlank String password
    ) {}
}
