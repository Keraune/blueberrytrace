package com.keraune.vlvblueberrysystem.api.dto;

import com.keraune.vlvblueberrysystem.dto.DashboardSummary;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class ApiPayloads {

    private ApiPayloads() {
    }

    public record ApiResponse<T>(
            boolean success,
            String message,
            T data
    ) {
        public static <T> ApiResponse<T> ok(T data) {
            return new ApiResponse<>(true, "Solicitud procesada correctamente.", data);
        }

        public static <T> ApiResponse<T> ok(String message, T data) {
            return new ApiResponse<>(true, message, data);
        }
    }

    public record ListResponse<T>(
            long total,
            List<T> items
    ) {
        public static <T> ListResponse<T> from(List<T> items) {
            return new ListResponse<>(items.size(), items);
        }
    }

    public record ReferenceResponse(
            Long id,
            String codigo,
            String descripcion
    ) {
    }

    public record UserReferenceResponse(
            Long id,
            String username,
            String nombreCompleto,
            String email,
            String cargo,
            String telefono,
            String avatarColor,
            String rol,
            Boolean activo,
            LocalDateTime fechaCreacion,
            LocalDateTime fechaActualizacion
    ) {
    }

    public record AuthenticatedUserResponse(
            String username,
            String nombreCompleto,
            String email,
            String cargo,
            String telefono,
            String avatarColor,
            String rol,
            List<String> authorities
    ) {
    }

    public record UserFormPayload(
            @NotBlank(message = "El usuario es obligatorio.")
            @Size(max = 50, message = "El usuario no debe superar 50 caracteres.")
            String username,

            @NotBlank(message = "El nombre completo es obligatorio.")
            @Size(max = 150, message = "El nombre completo no debe superar 150 caracteres.")
            String nombreCompleto,

            @NotBlank(message = "El correo empresarial es obligatorio.")
            @Email(message = "Ingresa un correo empresarial válido.")
            @Size(max = 120, message = "El correo no debe superar 120 caracteres.")
            String email,

            @Size(max = 90, message = "El cargo no debe superar 90 caracteres.")
            String cargo,

            @Size(max = 30, message = "El teléfono no debe superar 30 caracteres.")
            String telefono,

            @Size(max = 24, message = "El color de avatar no debe superar 24 caracteres.")
            String avatarColor,

            @NotBlank(message = "El rol es obligatorio.")
            String rol,

            @Size(max = 120, message = "La contraseña no debe superar 120 caracteres.")
            String password,

            Boolean activo
    ) {
    }



    public record ProfileUpdatePayload(
            @NotBlank(message = "El nombre completo es obligatorio.")
            @Size(max = 150, message = "El nombre completo no debe superar 150 caracteres.")
            String nombreCompleto,

            @NotBlank(message = "El correo empresarial es obligatorio.")
            @Email(message = "Ingresa un correo empresarial válido.")
            @Size(max = 120, message = "El correo no debe superar 120 caracteres.")
            String email,

            @Size(max = 90, message = "El cargo no debe superar 90 caracteres.")
            String cargo,

            @Size(max = 30, message = "El teléfono no debe superar 30 caracteres.")
            String telefono,

            @Size(max = 24, message = "El color de avatar no debe superar 24 caracteres.")
            String avatarColor
    ) {
    }

    public record PasswordChangePayload(
            @NotBlank(message = "Ingresa tu contraseña actual.")
            String currentPassword,

            @NotBlank(message = "Ingresa la nueva contraseña.")
            @Size(min = 8, max = 120, message = "La nueva contraseña debe tener entre 8 y 120 caracteres.")
            String newPassword
    ) {
    }

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
    ) {
    }

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
    ) {
    }

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
    ) {
    }

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
    ) {
    }

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
    ) {
    }

    public record ProcesoOperativoResponse(
            ListResponse<UniformizacionResponse> uniformizaciones,
            ListResponse<FormalizacionResponse> formalizaciones
    ) {
    }

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
    ) {
    }

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
    ) {
    }

    public record TrazabilidadResponse(
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
    ) {
    }

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
    ) {
    }

    public record EndpointResponse(
            String method,
            String path,
            String description
    ) {
    }

    public record FrontendBootstrapResponse(
            String appName,
            String apiVersion,
            String strategy,
            List<String> supportedFrontends,
            List<EndpointResponse> endpoints,
            List<ModuleResponse> modules,
            PaletteResponse palette
    ) {
    }

    public record ModuleResponse(
            String key,
            String label,
            String mvcPath,
            String apiPath
    ) {
    }

    public record PaletteResponse(
            String darkGreen,
            String primaryGreen,
            String blueberryBlue,
            String blueberryPurple,
            String lime,
            String orange,
            String surface,
            String background
    ) {
    }

    public record DashboardApiResponse(
            DashboardSummary summary,
            List<ModuleResponse> modules
    ) {
    }
}
