package com.keraune.vlvblueberrysystem.service;

import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.DespachoResponse;
import com.keraune.vlvblueberrysystem.api.mapper.ApiRecordMapper;
import com.keraune.vlvblueberrysystem.dto.DespachoForm;
import com.keraune.vlvblueberrysystem.entity.Despacho;
import com.keraune.vlvblueberrysystem.repository.DespachoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class DespachoService {
    private final DespachoRepository despachoRepository;
    private final AccountService accountService;
    private final OperationReferenceService references;
    private final ApiRecordMapper mapper;

    public DespachoService(DespachoRepository despachoRepository, AccountService accountService, OperationReferenceService references, ApiRecordMapper mapper) {
        this.despachoRepository = despachoRepository;
        this.accountService = accountService;
        this.references = references;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<DespachoResponse> list() {
        return despachoRepository.findAllByOrderByFechaDespachoDescIdDesc().stream().map(mapper::despacho).toList();
    }

    public List<DespachoResponse> create(DespachoForm form) {
        Despacho entity = new Despacho();
        entity.setUsuarioRegistro(accountService.currentUser());
        apply(entity, form);
        despachoRepository.save(entity);
        return list();
    }

    public List<DespachoResponse> update(Long id, DespachoForm form) {
        Despacho entity = despachoRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Despacho no encontrado"));
        apply(entity, form);
        return list();
    }

    public List<DespachoResponse> changeStatus(Long id, String estado) {
        Despacho entity = despachoRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Despacho no encontrado"));
        entity.setEstado(references.clean(estado, "REGISTRADO"));
        return list();
    }

    private void apply(Despacho entity, DespachoForm form) {
        entity.setLote(references.lote(form.loteId()));
        entity.setFechaDespacho(form.fechaDespacho());
        entity.setModalidadDespacho(references.clean(form.modalidad(), "JABAS"));
        entity.setModalidad(entity.getModalidadDespacho());
        entity.setCantidadDespachada(form.cantidadDespachada());
        entity.setCantidad(form.cantidadDespachada());
        entity.setDestino(references.trim(form.destino()));
        entity.setGuiaRemision(references.trim(form.guiaRemision()));
        entity.setValidacionCalidad(form.validacionCalidad().trim());
        entity.setObservacion(references.trim(form.observacion()));
        entity.setEstado(references.clean(form.estado(), "REGISTRADO"));
    }
}
