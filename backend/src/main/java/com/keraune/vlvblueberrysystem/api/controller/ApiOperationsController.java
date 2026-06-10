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
import com.keraune.vlvblueberrysystem.entity.User;
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
import jakarta.validation.Valid;
import java.security.Principal;
import org.springframework.format.annotation.DateTimeFormat;
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
    private final ApiRecordMapper mapper;

    public ApiOperationsController(LoteService loteService,
                                   CamaService camaService,
                                   SiembraService siembraService,
                                   ProcesoOperativoService procesoOperativoService,
                                   ClasificacionService clasificacionService,
                                   DespachoService despachoService,
                                   TrazabilidadQueryService trazabilidadQueryService,
                                   UserRepository userRepository,
                                   ApiRecordMapper mapper) {
        this.loteService = loteService;
        this.camaService = camaService;
        this.siembraService = siembraService;
        this.procesoOperativoService = procesoOperativoService;
        this.clasificacionService = clasificacionService;
        this.despachoService = despachoService;
        this.trazabilidadQueryService = trazabilidadQueryService;
        this.userRepository = userRepository;
        this.mapper = mapper;
    }

    @GetMapping("/catalogs/operations")
    public ApiResponse<CatalogResponse> operationCatalogs() {
        CatalogResponse response = new CatalogResponse(
                loteService.listarTodos().stream().map(mapper::toLoteReference).toList(),
                camaService.listarTodas().stream().map(mapper::toCamaReference).toList(),
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

    @PatchMapping("/siembras/{id}/estado")
    public ApiResponse<ListResponse<SiembraResponse>> cambiarEstadoSiembra(@PathVariable Long id) {
        siembraService.cambiarEstado(id);
        return ApiResponse.ok("Estado de la siembra actualizado.", siembras().data());
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

    private UserReferenceResponse toUserReference(User user) {
        return new UserReferenceResponse(
                user.getId(),
                user.getUsername(),
                user.getNombreCompleto(),
                user.getEmail(),
                user.getRol() == null ? null : user.getRol().getNombre(),
                user.getEstado()
        );
    }
}
