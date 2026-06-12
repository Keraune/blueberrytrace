package com.keraune.vlvblueberrysystem.api.controller;

import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.*;
import com.keraune.vlvblueberrysystem.api.mapper.ApiRecordMapper;
import com.keraune.vlvblueberrysystem.dto.*;
import com.keraune.vlvblueberrysystem.repository.CamaRepository;
import com.keraune.vlvblueberrysystem.repository.LoteRepository;
import com.keraune.vlvblueberrysystem.service.*;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class ApiOperationsController {
    private final LoteService loteService;
    private final CamaService camaService;
    private final SiembraService siembraService;
    private final ProcesoOperativoService procesoService;
    private final ClasificacionService clasificacionService;
    private final DespachoService despachoService;
    private final TrazabilidadQueryService trazabilidadService;
    private final AccountService accountService;
    private final LoteRepository loteRepository;
    private final CamaRepository camaRepository;
    private final ApiRecordMapper mapper;

    public ApiOperationsController(LoteService loteService, CamaService camaService, SiembraService siembraService,
                                   ProcesoOperativoService procesoService, ClasificacionService clasificacionService,
                                   DespachoService despachoService, TrazabilidadQueryService trazabilidadService,
                                   AccountService accountService, LoteRepository loteRepository, CamaRepository camaRepository,
                                   ApiRecordMapper mapper) {
        this.loteService = loteService;
        this.camaService = camaService;
        this.siembraService = siembraService;
        this.procesoService = procesoService;
        this.clasificacionService = clasificacionService;
        this.despachoService = despachoService;
        this.trazabilidadService = trazabilidadService;
        this.accountService = accountService;
        this.loteRepository = loteRepository;
        this.camaRepository = camaRepository;
        this.mapper = mapper;
    }

    @GetMapping("/catalogs/operations")
    public ApiResponse<CatalogResponse> catalogs() {
        CatalogResponse response = new CatalogResponse(
                loteRepository.findAllByOrderByFechaRegistroDescIdDesc().stream().map(mapper::reference).toList(),
                camaRepository.findAllByOrderByCodigoAsc().stream().map(mapper::reference).toList(),
                accountService.activeRoles(),
                List.of("ACTIVO", "INACTIVO"),
                List.of("ACTIVA", "INACTIVA", "MANTENIMIENTO"),
                List.of("REGISTRADA", "ANULADA"),
                List.of("PENDIENTE", "VALIDADA", "OBSERVADA"),
                List.of("REGISTRADO", "DESPACHADO", "OBSERVADO", "CANCELADO"),
                List.of("JABAS", "BINS", "MADERA", "OTRO"),
                List.of("APTO", "OBSERVADO", "REQUIERE_REVISIÓN")
        );
        return ApiResponse.ok("Catálogos operativos cargados", response);
    }

    @GetMapping("/lotes")
    public ApiResponse<ListResponse<LoteResponse>> lotes() { return ApiResponse.ok("Lotes cargados", mapper.list(loteService.list())); }
    @PostMapping("/lotes")
    public ApiResponse<ListResponse<LoteResponse>> createLote(@Valid @RequestBody LoteForm form) { return ApiResponse.ok("Lote registrado", mapper.list(loteService.create(form))); }
    @PutMapping("/lotes/{id}")
    public ApiResponse<ListResponse<LoteResponse>> updateLote(@PathVariable Long id, @Valid @RequestBody LoteForm form) { return ApiResponse.ok("Lote actualizado", mapper.list(loteService.update(id, form))); }
    @PatchMapping("/lotes/{id}/estado")
    public ApiResponse<ListResponse<LoteResponse>> toggleLote(@PathVariable Long id) { return ApiResponse.ok("Estado de lote actualizado", mapper.list(loteService.toggleStatus(id))); }
    @DeleteMapping("/lotes/{id}")
    public ApiResponse<ListResponse<LoteResponse>> deleteLote(@PathVariable Long id) { return ApiResponse.ok("Lote eliminado", mapper.list(loteService.delete(id))); }

    @GetMapping("/camas")
    public ApiResponse<ListResponse<CamaResponse>> camas() { return ApiResponse.ok("Camas cargadas", mapper.list(camaService.list())); }
    @PostMapping("/camas")
    public ApiResponse<ListResponse<CamaResponse>> createCama(@Valid @RequestBody CamaForm form) { return ApiResponse.ok("Cama registrada", mapper.list(camaService.create(form))); }
    @PutMapping("/camas/{id}")
    public ApiResponse<ListResponse<CamaResponse>> updateCama(@PathVariable Long id, @Valid @RequestBody CamaForm form) { return ApiResponse.ok("Cama actualizada", mapper.list(camaService.update(id, form))); }
    @PatchMapping("/camas/{id}/estado")
    public ApiResponse<ListResponse<CamaResponse>> toggleCama(@PathVariable Long id) { return ApiResponse.ok("Estado de cama actualizado", mapper.list(camaService.toggleStatus(id))); }

    @GetMapping("/siembras")
    public ApiResponse<ListResponse<SiembraResponse>> siembras() { return ApiResponse.ok("Siembras cargadas", mapper.list(siembraService.list())); }
    @PostMapping("/siembras")
    public ApiResponse<ListResponse<SiembraResponse>> createSiembra(@Valid @RequestBody SiembraForm form) { return ApiResponse.ok("Siembra registrada", mapper.list(siembraService.create(form))); }
    @PutMapping("/siembras/{id}")
    public ApiResponse<ListResponse<SiembraResponse>> updateSiembra(@PathVariable Long id, @Valid @RequestBody SiembraForm form) { return ApiResponse.ok("Siembra actualizada", mapper.list(siembraService.update(id, form))); }
    @PatchMapping("/siembras/{id}/estado")
    public ApiResponse<ListResponse<SiembraResponse>> toggleSiembra(@PathVariable Long id) { return ApiResponse.ok("Estado de siembra actualizado", mapper.list(siembraService.toggleStatus(id))); }
    @DeleteMapping("/siembras/{id}")
    public ApiResponse<ListResponse<SiembraResponse>> deleteSiembra(@PathVariable Long id) { return ApiResponse.ok("Siembra eliminada", mapper.list(siembraService.delete(id))); }

    @GetMapping("/procesos")
    public ApiResponse<ProcesoOperativoResponse> procesos() { return ApiResponse.ok("Procesos cargados", procesoService.list()); }
    @PostMapping("/procesos/uniformizaciones")
    public ApiResponse<ProcesoOperativoResponse> createUniformizacion(@Valid @RequestBody UniformizacionForm form) { return ApiResponse.ok("Uniformización registrada", procesoService.createUniformizacion(form)); }
    @PutMapping("/procesos/uniformizaciones/{id}")
    public ApiResponse<ProcesoOperativoResponse> updateUniformizacion(@PathVariable Long id, @Valid @RequestBody UniformizacionForm form) { return ApiResponse.ok("Uniformización actualizada", procesoService.updateUniformizacion(id, form)); }
    @PatchMapping("/procesos/uniformizaciones/{id}/estado")
    public ApiResponse<ProcesoOperativoResponse> toggleUniformizacion(@PathVariable Long id) { return ApiResponse.ok("Estado de uniformización actualizado", procesoService.toggleUniformizacionStatus(id)); }
    @DeleteMapping("/procesos/uniformizaciones/{id}")
    public ApiResponse<ProcesoOperativoResponse> deleteUniformizacion(@PathVariable Long id) { return ApiResponse.ok("Uniformización eliminada", procesoService.deleteUniformizacion(id)); }
    @PostMapping("/procesos/formalizaciones")
    public ApiResponse<ProcesoOperativoResponse> createFormalizacion(@Valid @RequestBody FormalizacionForm form) { return ApiResponse.ok("Formalización registrada", procesoService.createFormalizacion(form)); }
    @PutMapping("/procesos/formalizaciones/{id}")
    public ApiResponse<ProcesoOperativoResponse> updateFormalizacion(@PathVariable Long id, @Valid @RequestBody FormalizacionForm form) { return ApiResponse.ok("Formalización actualizada", procesoService.updateFormalizacion(id, form)); }
    @PatchMapping("/procesos/formalizaciones/{id}/estado")
    public ApiResponse<ProcesoOperativoResponse> toggleFormalizacion(@PathVariable Long id) { return ApiResponse.ok("Estado de formalización actualizado", procesoService.toggleFormalizacionStatus(id)); }
    @DeleteMapping("/procesos/formalizaciones/{id}")
    public ApiResponse<ProcesoOperativoResponse> deleteFormalizacion(@PathVariable Long id) { return ApiResponse.ok("Formalización eliminada", procesoService.deleteFormalizacion(id)); }

    @GetMapping("/clasificaciones")
    public ApiResponse<ListResponse<ClasificacionResponse>> clasificaciones() { return ApiResponse.ok("Clasificaciones cargadas", mapper.list(clasificacionService.list())); }
    @PostMapping("/clasificaciones")
    public ApiResponse<ListResponse<ClasificacionResponse>> createClasificacion(@Valid @RequestBody ClasificacionForm form) { return ApiResponse.ok("Clasificación registrada", mapper.list(clasificacionService.create(form))); }
    @PutMapping("/clasificaciones/{id}")
    public ApiResponse<ListResponse<ClasificacionResponse>> updateClasificacion(@PathVariable Long id, @Valid @RequestBody ClasificacionForm form) { return ApiResponse.ok("Clasificación actualizada", mapper.list(clasificacionService.update(id, form))); }
    @PatchMapping("/clasificaciones/{id}/estado")
    public ApiResponse<ListResponse<ClasificacionResponse>> changeClasificacionStatus(@PathVariable Long id, @RequestParam String estado) { return ApiResponse.ok("Estado de clasificación actualizado", mapper.list(clasificacionService.changeStatus(id, estado))); }

    @GetMapping("/despachos")
    public ApiResponse<ListResponse<DespachoResponse>> despachos() { return ApiResponse.ok("Despachos cargados", mapper.list(despachoService.list())); }
    @PostMapping("/despachos")
    public ApiResponse<ListResponse<DespachoResponse>> createDespacho(@Valid @RequestBody DespachoForm form) { return ApiResponse.ok("Despacho registrado", mapper.list(despachoService.create(form))); }
    @PutMapping("/despachos/{id}")
    public ApiResponse<ListResponse<DespachoResponse>> updateDespacho(@PathVariable Long id, @Valid @RequestBody DespachoForm form) { return ApiResponse.ok("Despacho actualizado", mapper.list(despachoService.update(id, form))); }
    @PatchMapping("/despachos/{id}/estado")
    public ApiResponse<ListResponse<DespachoResponse>> changeDespachoStatus(@PathVariable Long id, @RequestParam String estado) { return ApiResponse.ok("Estado de despacho actualizado", mapper.list(despachoService.changeStatus(id, estado))); }

    @GetMapping("/reportes/trazabilidad")
    public ApiResponse<ListResponse<TrazabilidadResponse>> trazabilidad() { return ApiResponse.ok("Trazabilidad cargada", mapper.list(trazabilidadService.list())); }

    @GetMapping("/usuarios")
    public ApiResponse<ListResponse<UserReferenceResponse>> usuarios() { return ApiResponse.ok("Usuarios cargados", mapper.list(accountService.listUsers())); }
    @GetMapping("/roles")
    public ApiResponse<List<String>> roles() { return ApiResponse.ok("Roles cargados", accountService.activeRoles()); }
    @PostMapping("/usuarios")
    public ApiResponse<ListResponse<UserReferenceResponse>> createUsuario(@Valid @RequestBody UserFormPayload payload) { return ApiResponse.ok("Usuario creado", mapper.list(accountService.createUser(payload))); }
    @PutMapping("/usuarios/{id}")
    public ApiResponse<ListResponse<UserReferenceResponse>> updateUsuario(@PathVariable Long id, @Valid @RequestBody UserFormPayload payload) { return ApiResponse.ok("Usuario actualizado", mapper.list(accountService.updateUser(id, payload))); }
    @PatchMapping("/usuarios/{id}/estado")
    public ApiResponse<ListResponse<UserReferenceResponse>> toggleUsuario(@PathVariable Long id) { return ApiResponse.ok("Estado de usuario actualizado", mapper.list(accountService.toggleUserStatus(id))); }
}
