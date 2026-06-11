package com.keraune.vlvblueberrysystem.service;

import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.ClasificacionResponse;
import com.keraune.vlvblueberrysystem.api.mapper.ApiRecordMapper;
import com.keraune.vlvblueberrysystem.dto.ClasificacionForm;
import com.keraune.vlvblueberrysystem.entity.Clasificacion;
import com.keraune.vlvblueberrysystem.repository.ClasificacionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ClasificacionService {
    private final ClasificacionRepository clasificacionRepository;
    private final AccountService accountService;
    private final OperationReferenceService references;
    private final ApiRecordMapper mapper;

    public ClasificacionService(ClasificacionRepository clasificacionRepository, AccountService accountService, OperationReferenceService references, ApiRecordMapper mapper) {
        this.clasificacionRepository = clasificacionRepository;
        this.accountService = accountService;
        this.references = references;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<ClasificacionResponse> list() {
        return clasificacionRepository.findAllByOrderByFechaClasificacionDescIdDesc().stream().map(mapper::clasificacion).toList();
    }

    public List<ClasificacionResponse> create(ClasificacionForm form) {
        Clasificacion entity = new Clasificacion();
        entity.setUsuarioRegistro(accountService.currentUser());
        apply(entity, form);
        clasificacionRepository.save(entity);
        return list();
    }

    public List<ClasificacionResponse> update(Long id, ClasificacionForm form) {
        Clasificacion entity = clasificacionRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Clasificación no encontrada"));
        apply(entity, form);
        return list();
    }

    public List<ClasificacionResponse> changeStatus(Long id, String estado) {
        Clasificacion entity = clasificacionRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Clasificación no encontrada"));
        entity.setEstado(references.clean(estado, "PENDIENTE"));
        return list();
    }

    private void apply(Clasificacion entity, ClasificacionForm form) {
        entity.setLote(references.lote(form.loteId()));
        entity.setCama(references.camaDelLote(form.camaId(), form.loteId()));
        entity.setFechaClasificacion(form.fechaClasificacion());
        entity.setEstadoPlanta(form.estadoPlanta().trim());
        entity.setTamano(form.tamano().trim());
        entity.setCondicion(form.condicion().trim());
        entity.setCantidad(form.cantidad());
        entity.setObservacion(references.trim(form.observacion()));
        entity.setEstado(references.clean(form.estado(), "PENDIENTE"));
    }
}
