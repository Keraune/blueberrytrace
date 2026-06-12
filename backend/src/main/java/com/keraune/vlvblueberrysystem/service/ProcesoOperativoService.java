package com.keraune.vlvblueberrysystem.service;

import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.FormalizacionResponse;
import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.ProcesoOperativoResponse;
import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.UniformizacionResponse;
import com.keraune.vlvblueberrysystem.api.mapper.ApiRecordMapper;
import com.keraune.vlvblueberrysystem.dto.FormalizacionForm;
import com.keraune.vlvblueberrysystem.dto.UniformizacionForm;
import com.keraune.vlvblueberrysystem.entity.Formalizacion;
import com.keraune.vlvblueberrysystem.entity.Uniformizacion;
import com.keraune.vlvblueberrysystem.repository.FormalizacionRepository;
import com.keraune.vlvblueberrysystem.repository.UniformizacionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProcesoOperativoService {
    private final UniformizacionRepository uniformizacionRepository;
    private final FormalizacionRepository formalizacionRepository;
    private final AccountService accountService;
    private final OperationReferenceService references;
    private final ApiRecordMapper mapper;

    public ProcesoOperativoService(UniformizacionRepository uniformizacionRepository, FormalizacionRepository formalizacionRepository,
                                   AccountService accountService, OperationReferenceService references, ApiRecordMapper mapper) {
        this.uniformizacionRepository = uniformizacionRepository;
        this.formalizacionRepository = formalizacionRepository;
        this.accountService = accountService;
        this.references = references;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public ProcesoOperativoResponse list() {
        List<UniformizacionResponse> uniformizaciones = uniformizacionRepository.findAllByOrderByFechaUniformizacionDescIdDesc().stream().map(mapper::uniformizacion).toList();
        List<FormalizacionResponse> formalizaciones = formalizacionRepository.findAllByOrderByFechaFormalizacionDescIdDesc().stream().map(mapper::formalizacion).toList();
        return new ProcesoOperativoResponse(mapper.list(uniformizaciones), mapper.list(formalizaciones));
    }

    public ProcesoOperativoResponse createUniformizacion(UniformizacionForm form) {
        Uniformizacion entity = new Uniformizacion();
        entity.setUsuarioRegistro(accountService.currentUser());
        apply(entity, form);
        uniformizacionRepository.save(entity);
        return list();
    }

    public ProcesoOperativoResponse updateUniformizacion(Long id, UniformizacionForm form) {
        Uniformizacion entity = uniformizacionRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Uniformización no encontrada"));
        apply(entity, form);
        return list();
    }

    public ProcesoOperativoResponse toggleUniformizacionStatus(Long id) {
        Uniformizacion entity = uniformizacionRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Uniformización no encontrada"));
        entity.setEstado("REGISTRADA".equalsIgnoreCase(entity.getEstado()) ? "ANULADA" : "REGISTRADA");
        return list();
    }

    public ProcesoOperativoResponse deleteUniformizacion(Long id) {
        Uniformizacion entity = uniformizacionRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Uniformización no encontrada"));
        uniformizacionRepository.delete(entity);
        return list();
    }

    public ProcesoOperativoResponse createFormalizacion(FormalizacionForm form) {
        Formalizacion entity = new Formalizacion();
        entity.setUsuarioRegistro(accountService.currentUser());
        apply(entity, form);
        formalizacionRepository.save(entity);
        return list();
    }

    public ProcesoOperativoResponse updateFormalizacion(Long id, FormalizacionForm form) {
        Formalizacion entity = formalizacionRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Formalización no encontrada"));
        apply(entity, form);
        return list();
    }

    public ProcesoOperativoResponse toggleFormalizacionStatus(Long id) {
        Formalizacion entity = formalizacionRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Formalización no encontrada"));
        entity.setEstado("REGISTRADA".equalsIgnoreCase(entity.getEstado()) ? "ANULADA" : "REGISTRADA");
        return list();
    }

    public ProcesoOperativoResponse deleteFormalizacion(Long id) {
        Formalizacion entity = formalizacionRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Formalización no encontrada"));
        formalizacionRepository.delete(entity);
        return list();
    }

    private void apply(Uniformizacion entity, UniformizacionForm form) {
        entity.setLote(references.lote(form.loteId()));
        entity.setCama(references.camaDelLote(form.camaId(), form.loteId()));
        entity.setFechaUniformizacion(form.fechaUniformizacion());
        entity.setCriterio(form.criterio().trim());
        entity.setCantidadInicial(form.cantidadInicial());
        entity.setCantidadUniformizada(form.cantidadUniformizada());
        entity.setObservacion(references.trim(form.observacion()));
        entity.setEstado(references.clean(form.estado(), "REGISTRADA"));
    }

    private void apply(Formalizacion entity, FormalizacionForm form) {
        entity.setLote(references.lote(form.loteId()));
        entity.setCama(references.camaDelLote(form.camaId(), form.loteId()));
        entity.setFechaFormalizacion(form.fechaFormalizacion());
        entity.setDetalle(form.detalle().trim());
        entity.setCantidadBandejas(form.cantidadBandejas());
        entity.setCantidadPlantas(form.cantidadPlantas());
        entity.setObservacion(references.trim(form.observacion()));
        entity.setEstado(references.clean(form.estado(), "REGISTRADA"));
    }
}
