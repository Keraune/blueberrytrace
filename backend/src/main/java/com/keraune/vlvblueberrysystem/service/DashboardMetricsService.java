package com.keraune.vlvblueberrysystem.service;

import com.keraune.vlvblueberrysystem.dto.DashboardSummary;
import com.keraune.vlvblueberrysystem.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class DashboardMetricsService {
    private final LoteRepository loteRepository;
    private final CamaRepository camaRepository;
    private final SiembraRepository siembraRepository;
    private final UniformizacionRepository uniformizacionRepository;
    private final FormalizacionRepository formalizacionRepository;
    private final ClasificacionRepository clasificacionRepository;
    private final DespachoRepository despachoRepository;

    public DashboardMetricsService(LoteRepository loteRepository, CamaRepository camaRepository, SiembraRepository siembraRepository,
                                   UniformizacionRepository uniformizacionRepository, FormalizacionRepository formalizacionRepository,
                                   ClasificacionRepository clasificacionRepository, DespachoRepository despachoRepository) {
        this.loteRepository = loteRepository;
        this.camaRepository = camaRepository;
        this.siembraRepository = siembraRepository;
        this.uniformizacionRepository = uniformizacionRepository;
        this.formalizacionRepository = formalizacionRepository;
        this.clasificacionRepository = clasificacionRepository;
        this.despachoRepository = despachoRepository;
    }

    public DashboardSummary summary() {
        long lotes = loteRepository.count();
        long lotesActivos = loteRepository.countByEstadoIgnoreCase("ACTIVO");
        long camas = camaRepository.count();
        long camasActivas = camaRepository.countByEstadoIgnoreCase("ACTIVA");
        long siembras = siembraRepository.count();
        long plantasSembradas = siembraRepository.findAll().stream().mapToLong(s -> value(s.getCantidadRegistrada())).sum();
        long uniformizaciones = uniformizacionRepository.count();
        long formalizaciones = formalizacionRepository.count();
        long clasificaciones = clasificacionRepository.count();
        long pendientes = clasificacionRepository.countByEstadoIgnoreCase("PENDIENTE");
        long validadas = clasificacionRepository.countByEstadoIgnoreCase("VALIDADA");
        long despachos = despachoRepository.count();
        long plantasDespachadas = despachoRepository.findAll().stream().mapToLong(d -> value(d.getCantidadDespachada())).sum();
        long capacidad = camaRepository.findAll().stream().mapToLong(c -> value(c.getCapacidadReferencial())).sum();

        return new DashboardSummary(
                lotes, lotesActivos, Math.max(lotes - lotesActivos, 0),
                camas, camasActivas, Math.max(camas - camasActivas, 0), capacidad,
                siembras, plantasSembradas, uniformizaciones, formalizaciones,
                clasificaciones, pendientes, validadas, despachos, plantasDespachadas,
                pct(lotesActivos, lotes), pct(camasActivas, camas), pct(validadas, clasificaciones), pct(plantasDespachadas, plantasSembradas),
                pct(uniformizaciones, siembras), pct(formalizaciones, siembras), pct(clasificaciones, siembras), pct(despachos, siembras)
        );
    }

    private long value(Integer value) { return value == null ? 0 : value; }
    private double pct(long part, long total) { return total <= 0 ? 0 : Math.round((part * 10000.0 / total)) / 100.0; }
}
