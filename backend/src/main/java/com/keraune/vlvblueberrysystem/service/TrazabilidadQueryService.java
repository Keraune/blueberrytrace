package com.keraune.vlvblueberrysystem.service;

import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.TrazabilidadResponse;
import com.keraune.vlvblueberrysystem.api.mapper.ApiRecordMapper;
import com.keraune.vlvblueberrysystem.dto.TrazabilidadRow;
import com.keraune.vlvblueberrysystem.entity.Lote;
import com.keraune.vlvblueberrysystem.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class TrazabilidadQueryService {
    private final LoteRepository loteRepository;
    private final CamaRepository camaRepository;
    private final SiembraRepository siembraRepository;
    private final UniformizacionRepository uniformizacionRepository;
    private final FormalizacionRepository formalizacionRepository;
    private final ClasificacionRepository clasificacionRepository;
    private final DespachoRepository despachoRepository;
    private final ApiRecordMapper mapper;

    public TrazabilidadQueryService(LoteRepository loteRepository, CamaRepository camaRepository, SiembraRepository siembraRepository,
                                    UniformizacionRepository uniformizacionRepository, FormalizacionRepository formalizacionRepository,
                                    ClasificacionRepository clasificacionRepository, DespachoRepository despachoRepository, ApiRecordMapper mapper) {
        this.loteRepository = loteRepository;
        this.camaRepository = camaRepository;
        this.siembraRepository = siembraRepository;
        this.uniformizacionRepository = uniformizacionRepository;
        this.formalizacionRepository = formalizacionRepository;
        this.clasificacionRepository = clasificacionRepository;
        this.despachoRepository = despachoRepository;
        this.mapper = mapper;
    }

    public List<TrazabilidadResponse> list() {
        return loteRepository.findAllByOrderByFechaRegistroDescIdDesc().stream()
                .map(this::rowFor)
                .map(mapper::trazabilidad)
                .toList();
    }

    private TrazabilidadRow rowFor(Lote lote) {
        Long loteId = lote.getId();
        long camas = camaRepository.findAll().stream().filter(c -> c.getLote() != null && loteId.equals(c.getLote().getId())).count();
        var siembras = siembraRepository.findAll().stream().filter(s -> s.getLote() != null && loteId.equals(s.getLote().getId())).toList();
        var uniformizaciones = uniformizacionRepository.findAll().stream().filter(u -> u.getLote() != null && loteId.equals(u.getLote().getId())).toList();
        var formalizaciones = formalizacionRepository.findAll().stream().filter(f -> f.getLote() != null && loteId.equals(f.getLote().getId())).toList();
        var clasificaciones = clasificacionRepository.findAll().stream().filter(c -> c.getLote() != null && loteId.equals(c.getLote().getId())).toList();
        var despachos = despachoRepository.findAll().stream().filter(d -> d.getLote() != null && loteId.equals(d.getLote().getId())).toList();

        long plantasSembradas = siembras.stream().mapToLong(s -> s.getCantidadRegistrada() == null ? 0 : s.getCantidadRegistrada()).sum();
        long plantasDespachadas = despachos.stream().mapToLong(d -> d.getCantidadDespachada() == null ? 0 : d.getCantidadDespachada()).sum();
        String ultimoEvento = latestEvent(
                siembras.stream().map(s -> event(s.getFechaSiembra(), "Siembra registrada")).toList(),
                uniformizaciones.stream().map(u -> event(u.getFechaUniformizacion(), "Uniformización registrada")).toList(),
                formalizaciones.stream().map(f -> event(f.getFechaFormalizacion(), "Formalización registrada")).toList(),
                clasificaciones.stream().map(c -> event(c.getFechaClasificacion(), "Clasificación " + c.getEstado())).toList(),
                despachos.stream().map(d -> event(d.getFechaDespacho(), "Despacho " + d.getEstado())).toList()
        );
        return new TrazabilidadRow(lote.getId(), lote.getId(), lote.getCodigo(), lote.getDescripcion(), camas, siembras.size(), plantasSembradas,
                uniformizaciones.size(), formalizaciones.size(), clasificaciones.size(), despachos.size(), plantasDespachadas, ultimoEvento);
    }

    @SafeVarargs
    private String latestEvent(List<EventMarker>... markers) {
        return List.of(markers).stream().flatMap(List::stream)
                .filter(marker -> marker.date() != null)
                .max(Comparator.comparing(EventMarker::date))
                .map(marker -> marker.label() + " · " + marker.date())
                .orElse("Sin eventos operativos");
    }

    private EventMarker event(LocalDate date, String label) {
        return new EventMarker(date, label);
    }

    private record EventMarker(LocalDate date, String label) {}
}
