package com.keraune.vlvblueberrysystem.api.controller;

import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.ApiResponse;
import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.CamaResponse;
import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.CatalogResponse;
import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.ClasificacionResponse;
import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.DespachoResponse;
import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.FormalizacionResponse;
import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.ListResponse;
import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.LoteResponse;
import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.ProcesoOperativoResponse;
import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.SiembraResponse;
import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.TrazabilidadResponse;
import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.UserFormPayload;
import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.UniformizacionResponse;
import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.UserReferenceResponse;
import com.keraune.vlvblueberrysystem.api.mapper.ApiRecordMapper;
import com.keraune.vlvblueberrysystem.dto.ClasificacionForm;
import com.keraune.vlvblueberrysystem.dto.DespachoForm;
import com.keraune.vlvblueberrysystem.dto.FormalizacionForm;
import com.keraune.vlvblueberrysystem.dto.SiembraForm;
import com.keraune.vlvblueberrysystem.dto.UniformizacionForm;
import com.keraune.vlvblueberrysystem.dto.CamaForm;
import com.keraune.vlvblueberrysystem.dto.LoteForm;
import com.keraune.vlvblueberrysystem.entity.Role;
import com.keraune.vlvblueberrysystem.entity.User;
import com.keraune.vlvblueberrysystem.repository.RoleRepository;
import com.keraune.vlvblueberrysystem.repository.UserRepository;
import com.keraune.vlvblueberrysystem.service.CamaService;
import com.keraune.vlvblueberrysystem.service.ClasificacionService;
import com.keraune.vlvblueberrysystem.service.DespachoService;
import com.keraune.vlvblueberrysystem.service.LoteService;
import com.keraune.vlvblueberrysystem.service.ProcesoOperativoService;
import com.keraune.vlvblueberrysystem.service.SiembraService;
import com.keraune.vlvblueberrysystem.service.TrazabilidadQueryService;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import jakarta.validation.Valid;
import java.security.Principal;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class ApiOperationsController {

    private final LoteService loteService;
    private final CamaService camaService;
    private final SiembraService siembraService;
    private final ProcesoOperativoService procesoOperativoService;
    private final ClasificacionService clasificacionService;
    private final DespachoService despachoService;
    private final TrazabilidadQueryService trazabilidadQueryService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final ApiRecordMapper mapper;

    public ApiOperationsController(LoteService loteService,
                                   CamaService camaService,
                                   SiembraService siembraService,
                                   ProcesoOperativoService procesoOperativoService,
                                   ClasificacionService clasificacionService,
                                   DespachoService despachoService,
                                   TrazabilidadQueryService trazabilidadQueryService,
                                   UserRepository userRepository,
                                   RoleRepository roleRepository,
                                   PasswordEncoder passwordEncoder,
                                   ApiRecordMapper mapper) {
        this.loteService = loteService;
        this.camaService = camaService;
        this.siembraService = siembraService;
        this.procesoOperativoService = procesoOperativoService;
        this.clasificacionService = clasificacionService;
        this.despachoService = despachoService;
        this.trazabilidadQueryService = trazabilidadQueryService;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.mapper = mapper;
    }

    @GetMapping("/catalogs/operations")
    public ApiResponse<CatalogResponse> operationCatalogs() {
        CatalogResponse response = new CatalogResponse(
                loteService.listarTodos().stream().map(mapper::toLoteReference).toList(),
                camaService.listarTodas().stream().map(mapper::toCamaReference).toList(),
                roleRepository.findAllByEstadoTrueOrderByNombreAsc().stream().map(Role::getNombre).toList(),
                List.of("ACTIVO", "INACTIVO", "MANTENIMIENTO", "ELIMINADO"),
                List.of("ACTIVA", "INACTIVA"),
                List.of("REGISTRADA", "ANULADA"),
                List.of("PENDIENTE", "VALIDADA", "OBSERVADA", "ANULADA"),
                List.of("REGISTRADO", "CERRADO", "OBSERVADO", "ANULADO"),
                List.of("JABAS", "BINS_MADERA"),
                List.of("APROBADO", "OBSERVADO", "RECHAZADO")
        );
        return ApiResponse.ok(response);
    }

    @GetMapping("/lotes")
    public ApiResponse<ListResponse<LoteResponse>> lotes() {
        List<LoteResponse> items = loteService.listarTodos().stream()
                .map(mapper::toLoteResponse)
                .toList();
        return ApiResponse.ok(ListResponse.from(items));
    }

    @PostMapping("/lotes")
    public ApiResponse<ListResponse<LoteResponse>> crearLote(@Valid @RequestBody LoteForm form, Principal principal) {
        loteService.crearLote(form, principal.getName());
        return ApiResponse.ok("Invernadero registrado correctamente.", lotes().data());
    }

    @PutMapping("/lotes/{id}")
    public ApiResponse<ListResponse<LoteResponse>> actualizarLote(@PathVariable Long id, @Valid @RequestBody LoteForm form) {
        loteService.actualizarLote(id, form);
        return ApiResponse.ok("Invernadero actualizado correctamente.", lotes().data());
    }

    @PatchMapping("/lotes/{id}/estado")
    public ApiResponse<ListResponse<LoteResponse>> cambiarEstadoLote(@PathVariable Long id) {
        loteService.cambiarEstado(id);
        return ApiResponse.ok("Estado del invernadero actualizado.", lotes().data());
    }

    @DeleteMapping("/lotes/{id}")
    public ApiResponse<ListResponse<LoteResponse>> eliminarLote(@PathVariable Long id) {
        loteService.eliminarLogicamente(id);
        return ApiResponse.ok("Invernadero enviado a eliminados.", lotes().data());
    }

    @GetMapping("/camas")
    public ApiResponse<ListResponse<CamaResponse>> camas() {
        List<CamaResponse> items = camaService.listarTodas().stream()
                .map(mapper::toCamaResponse)
                .toList();
        return ApiResponse.ok(ListResponse.from(items));
    }

    @PostMapping("/camas")
    public ApiResponse<ListResponse<CamaResponse>> crearCama(@Valid @RequestBody CamaForm form, Principal principal) {
        camaService.crearCama(form, principal.getName());
        return ApiResponse.ok("Cama registrada correctamente.", camas().data());
    }

    @PutMapping("/camas/{id}")
    public ApiResponse<ListResponse<CamaResponse>> actualizarCama(@PathVariable Long id, @Valid @RequestBody CamaForm form) {
        camaService.actualizarCama(id, form);
        return ApiResponse.ok("Cama actualizada correctamente.", camas().data());
    }

    @PatchMapping("/camas/{id}/estado")
    public ApiResponse<ListResponse<CamaResponse>> cambiarEstadoCama(@PathVariable Long id) {
        camaService.cambiarEstado(id);
        return ApiResponse.ok("Estado de la cama actualizado.", camas().data());
    }

    @GetMapping("/siembras")
    public ApiResponse<ListResponse<SiembraResponse>> siembras() {
        List<SiembraResponse> items = siembraService.listarTodas().stream()
                .map(mapper::toSiembraResponse)
                .toList();
        return ApiResponse.ok(ListResponse.from(items));
    }

    @PostMapping("/siembras")
    public ApiResponse<ListResponse<SiembraResponse>> crearSiembra(@Valid @RequestBody SiembraForm form, Principal principal) {
        siembraService.crearSiembra(form, principal.getName());
        return ApiResponse.ok("Siembra registrada correctamente.", siembras().data());
    }

    @PutMapping("/siembras/{id}")
    public ApiResponse<ListResponse<SiembraResponse>> actualizarSiembra(@PathVariable Long id, @Valid @RequestBody SiembraForm form) {
        siembraService.actualizarSiembra(id, form);
        return ApiResponse.ok("Siembra actualizada correctamente.", siembras().data());
    }

    @PatchMapping("/siembras/{id}/estado")
    public ApiResponse<ListResponse<SiembraResponse>> cambiarEstadoSiembra(@PathVariable Long id) {
        siembraService.cambiarEstado(id);
        return ApiResponse.ok("Estado de la siembra actualizado.", siembras().data());
    }

    @DeleteMapping("/siembras/{id}")
    public ApiResponse<ListResponse<SiembraResponse>> eliminarSiembra(@PathVariable Long id) {
        siembraService.eliminarSiembra(id);
        return ApiResponse.ok("Siembra eliminada correctamente.", siembras().data());
    }

    @GetMapping("/procesos")
    public ApiResponse<ProcesoOperativoResponse> procesos() {
        List<UniformizacionResponse> uniformizaciones = procesoOperativoService.listarUniformizaciones().stream()
                .map(mapper::toUniformizacionResponse)
                .toList();
        List<FormalizacionResponse> formalizaciones = procesoOperativoService.listarFormalizaciones().stream()
                .map(mapper::toFormalizacionResponse)
                .toList();
        ProcesoOperativoResponse response = new ProcesoOperativoResponse(
                ListResponse.from(uniformizaciones),
                ListResponse.from(formalizaciones)
        );
        return ApiResponse.ok(response);
    }

    @GetMapping("/procesos/uniformizaciones")
    public ApiResponse<ListResponse<UniformizacionResponse>> uniformizaciones() {
        List<UniformizacionResponse> items = procesoOperativoService.listarUniformizaciones().stream()
                .map(mapper::toUniformizacionResponse)
                .toList();
        return ApiResponse.ok(ListResponse.from(items));
    }

    @PostMapping("/procesos/uniformizaciones")
    public ApiResponse<ProcesoOperativoResponse> crearUniformizacion(@Valid @RequestBody UniformizacionForm form, Principal principal) {
        procesoOperativoService.crearUniformizacion(form, principal.getName());
        return ApiResponse.ok("Uniformización registrada correctamente.", procesos().data());
    }

    @PutMapping("/procesos/uniformizaciones/{id}")
    public ApiResponse<ProcesoOperativoResponse> actualizarUniformizacion(@PathVariable Long id, @Valid @RequestBody UniformizacionForm form) {
        procesoOperativoService.actualizarUniformizacion(id, form);
        return ApiResponse.ok("Uniformización actualizada correctamente.", procesos().data());
    }

    @PatchMapping("/procesos/uniformizaciones/{id}/estado")
    public ApiResponse<ProcesoOperativoResponse> cambiarEstadoUniformizacion(@PathVariable Long id) {
        procesoOperativoService.cambiarEstadoUniformizacion(id);
        return ApiResponse.ok("Estado de la uniformización actualizado.", procesos().data());
    }

    @GetMapping("/procesos/formalizaciones")
    public ApiResponse<ListResponse<FormalizacionResponse>> formalizaciones() {
        List<FormalizacionResponse> items = procesoOperativoService.listarFormalizaciones().stream()
                .map(mapper::toFormalizacionResponse)
                .toList();
        return ApiResponse.ok(ListResponse.from(items));
    }

    @PostMapping("/procesos/formalizaciones")
    public ApiResponse<ProcesoOperativoResponse> crearFormalizacion(@Valid @RequestBody FormalizacionForm form, Principal principal) {
        procesoOperativoService.crearFormalizacion(form, principal.getName());
        return ApiResponse.ok("Formalización registrada correctamente.", procesos().data());
    }

    @PutMapping("/procesos/formalizaciones/{id}")
    public ApiResponse<ProcesoOperativoResponse> actualizarFormalizacion(@PathVariable Long id, @Valid @RequestBody FormalizacionForm form) {
        procesoOperativoService.actualizarFormalizacion(id, form);
        return ApiResponse.ok("Formalización actualizada correctamente.", procesos().data());
    }

    @PatchMapping("/procesos/formalizaciones/{id}/estado")
    public ApiResponse<ProcesoOperativoResponse> cambiarEstadoFormalizacion(@PathVariable Long id) {
        procesoOperativoService.cambiarEstadoFormalizacion(id);
        return ApiResponse.ok("Estado de la formalización actualizado.", procesos().data());
    }

    @GetMapping("/clasificaciones")
    public ApiResponse<ListResponse<ClasificacionResponse>> clasificaciones() {
        List<ClasificacionResponse> items = clasificacionService.listarTodas().stream()
                .map(mapper::toClasificacionResponse)
                .toList();
        return ApiResponse.ok(ListResponse.from(items));
    }

    @PostMapping("/clasificaciones")
    public ApiResponse<ListResponse<ClasificacionResponse>> crearClasificacion(@Valid @RequestBody ClasificacionForm form, Principal principal) {
        clasificacionService.crearClasificacion(form, principal.getName());
        return ApiResponse.ok("Clasificación registrada correctamente.", clasificaciones().data());
    }

    @PutMapping("/clasificaciones/{id}")
    public ApiResponse<ListResponse<ClasificacionResponse>> actualizarClasificacion(@PathVariable Long id, @Valid @RequestBody ClasificacionForm form) {
        clasificacionService.actualizarClasificacion(id, form);
        return ApiResponse.ok("Clasificación actualizada correctamente.", clasificaciones().data());
    }

    @PatchMapping("/clasificaciones/{id}/estado")
    public ApiResponse<ListResponse<ClasificacionResponse>> cambiarEstadoClasificacion(
            @PathVariable Long id,
            @RequestParam(defaultValue = "VALIDADA") String estado
    ) {
        clasificacionService.cambiarEstado(id, estado);
        return ApiResponse.ok("Estado de la clasificación actualizado.", clasificaciones().data());
    }

    @GetMapping("/despachos")
    public ApiResponse<ListResponse<DespachoResponse>> despachos() {
        List<DespachoResponse> items = despachoService.listarTodos().stream()
                .map(mapper::toDespachoResponse)
                .toList();
        return ApiResponse.ok(ListResponse.from(items));
    }

    @PostMapping("/despachos")
    public ApiResponse<ListResponse<DespachoResponse>> crearDespacho(@Valid @RequestBody DespachoForm form, Principal principal) {
        despachoService.crearDespacho(form, principal.getName());
        return ApiResponse.ok("Despacho registrado correctamente.", despachos().data());
    }

    @PutMapping("/despachos/{id}")
    public ApiResponse<ListResponse<DespachoResponse>> actualizarDespacho(@PathVariable Long id, @Valid @RequestBody DespachoForm form) {
        despachoService.actualizarDespacho(id, form);
        return ApiResponse.ok("Despacho actualizado correctamente.", despachos().data());
    }

    @PatchMapping("/despachos/{id}/estado")
    public ApiResponse<ListResponse<DespachoResponse>> cambiarEstadoDespacho(
            @PathVariable Long id,
            @RequestParam(defaultValue = "CERRADO") String estado
    ) {
        despachoService.cambiarEstado(id, estado);
        return ApiResponse.ok("Estado del despacho actualizado.", despachos().data());
    }

    @GetMapping("/reportes/trazabilidad")
    public ApiResponse<ListResponse<TrazabilidadResponse>> trazabilidad(
            @RequestParam(required = false) String codigo,
            @RequestParam(required = false) String variedad,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha
    ) {
        List<TrazabilidadResponse> items = trazabilidadQueryService.buscar(codigo, variedad, fecha).stream()
                .map(mapper::toTrazabilidadResponse)
                .toList();
        return ApiResponse.ok(ListResponse.from(items));
    }

    @GetMapping("/usuarios")
    public ApiResponse<ListResponse<UserReferenceResponse>> usuarios() {
        List<UserReferenceResponse> items = userRepository.findAllByOrderByNombreCompletoAsc().stream()
                .map(this::toUserReference)
                .toList();
        return ApiResponse.ok(ListResponse.from(items));
    }

    @GetMapping("/roles")
    public ApiResponse<List<String>> roles() {
        return ApiResponse.ok(roleRepository.findAllByEstadoTrueOrderByNombreAsc().stream()
                .map(Role::getNombre)
                .toList());
    }

    @PostMapping("/usuarios")
    public ApiResponse<ListResponse<UserReferenceResponse>> crearUsuario(@Valid @RequestBody UserFormPayload payload) {
        User user = new User();
        applyUserPayload(user, payload, true);
        userRepository.save(user);
        return ApiResponse.ok("Usuario corporativo registrado correctamente.", usuarios().data());
    }

    @PutMapping("/usuarios/{id}")
    public ApiResponse<ListResponse<UserReferenceResponse>> actualizarUsuario(@PathVariable Long id, @Valid @RequestBody UserFormPayload payload) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("No se encontró el usuario solicitado."));
        applyUserPayload(user, payload, false);
        userRepository.save(user);
        return ApiResponse.ok("Usuario corporativo actualizado correctamente.", usuarios().data());
    }

    @PatchMapping("/usuarios/{id}/estado")
    public ApiResponse<ListResponse<UserReferenceResponse>> cambiarEstadoUsuario(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("No se encontró el usuario solicitado."));
        user.setEstado(!Boolean.TRUE.equals(user.getEstado()));
        userRepository.save(user);
        return ApiResponse.ok("Estado del usuario actualizado correctamente.", usuarios().data());
    }

    private void applyUserPayload(User user, UserFormPayload payload, boolean creating) {
        String username = normalizeUsername(payload.username());
        String email = normalizeEmail(payload.email());
        String roleName = normalizeRole(payload.rol());

        userRepository.findByUsernameIgnoreCase(username)
                .filter(existing -> !existing.getId().equals(user.getId()))
                .ifPresent(existing -> {
                    throw new IllegalArgumentException("Ya existe un usuario con ese nombre de acceso.");
                });

        userRepository.findByEmailIgnoreCase(email)
                .filter(existing -> !existing.getId().equals(user.getId()))
                .ifPresent(existing -> {
                    throw new IllegalArgumentException("Ya existe un usuario con ese correo empresarial.");
                });

        Role role = roleRepository.findByNombre(roleName)
                .orElseThrow(() -> new IllegalArgumentException("El rol seleccionado no existe o no está activo."));

        String password = payload.password() == null ? "" : payload.password().trim();
        if (creating && password.length() < 8) {
            throw new IllegalArgumentException("La contraseña inicial debe tener al menos 8 caracteres.");
        }
        if (!password.isBlank() && password.length() < 8) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 8 caracteres.");
        }

        user.setUsername(username);
        user.setEmail(email);
        user.setNombreCompleto(payload.nombreCompleto().trim());
        user.setCargo(cleanNullable(payload.cargo()));
        user.setTelefono(cleanNullable(payload.telefono()));
        user.setAvatarColor(normalizeAvatarColor(payload.avatarColor(), user.getAvatarColor()));
        user.setRol(role);
        user.setEstado(payload.activo() == null || payload.activo());

        if (!password.isBlank()) {
            user.setPassword(passwordEncoder.encode(password));
        }
    }



    private String cleanNullable(String value) {
        if (value == null || value.trim().isBlank()) {
            return null;
        }
        return value.trim();
    }

    private String normalizeAvatarColor(String requestedColor, String currentColor) {
        String value = requestedColor == null ? "" : requestedColor.trim();
        if (value.isBlank()) {
            return currentColor == null || currentColor.isBlank() ? "emerald" : currentColor;
        }
        if (!value.matches("^[a-zA-Z0-9_-]{3,24}$")) {
            throw new IllegalArgumentException("El color del avatar no es válido.");
        }
        return value;
    }

    private String normalizeUsername(String username) {
        String value = username == null ? "" : username.trim().toLowerCase(Locale.ROOT);
        if (!value.matches("^[a-z0-9._-]{3,50}$")) {
            throw new IllegalArgumentException("El usuario solo puede usar letras, números, punto, guion o guion bajo, con mínimo 3 caracteres.");
        }
        return value;
    }

    private String normalizeEmail(String email) {
        String value = email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
        if (!value.endsWith("@vlv.com")) {
            throw new IllegalArgumentException("El correo debe pertenecer al dominio corporativo @vlv.com.");
        }
        return value;
    }

    private String normalizeRole(String role) {
        return role == null ? "" : role.trim().toUpperCase(Locale.ROOT);
    }

    private UserReferenceResponse toUserReference(User user) {
        return new UserReferenceResponse(
                user.getId(),
                user.getUsername(),
                user.getNombreCompleto(),
                user.getEmail(),
                user.getCargo(),
                user.getTelefono(),
                user.getAvatarColor(),
                user.getRol() == null ? null : user.getRol().getNombre(),
                user.getEstado(),
                user.getFechaCreacion(),
                user.getFechaActualizacion()
        );
    }
}
