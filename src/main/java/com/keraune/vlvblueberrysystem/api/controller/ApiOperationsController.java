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
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
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

    @GetMapping("/camas")
    public ApiResponse<ListResponse<CamaResponse>> camas() {
        List<CamaResponse> items = camaService.listarTodas().stream()
                .map(mapper::toCamaResponse)
                .toList();
        return ApiResponse.ok(ListResponse.from(items));
    }

    @GetMapping("/siembras")
    public ApiResponse<ListResponse<SiembraResponse>> siembras() {
        List<SiembraResponse> items = siembraService.listarTodas().stream()
                .map(mapper::toSiembraResponse)
                .toList();
        return ApiResponse.ok(ListResponse.from(items));
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

    @GetMapping("/procesos/formalizaciones")
    public ApiResponse<ListResponse<FormalizacionResponse>> formalizaciones() {
        List<FormalizacionResponse> items = procesoOperativoService.listarFormalizaciones().stream()
                .map(mapper::toFormalizacionResponse)
                .toList();
        return ApiResponse.ok(ListResponse.from(items));
    }

    @GetMapping("/clasificaciones")
    public ApiResponse<ListResponse<ClasificacionResponse>> clasificaciones() {
        List<ClasificacionResponse> items = clasificacionService.listarTodas().stream()
                .map(mapper::toClasificacionResponse)
                .toList();
        return ApiResponse.ok(ListResponse.from(items));
    }

    @GetMapping("/despachos")
    public ApiResponse<ListResponse<DespachoResponse>> despachos() {
        List<DespachoResponse> items = despachoService.listarTodos().stream()
                .map(mapper::toDespachoResponse)
                .toList();
        return ApiResponse.ok(ListResponse.from(items));
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
