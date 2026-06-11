package com.keraune.vlvblueberrysystem.service;

import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.SiembraResponse;
import com.keraune.vlvblueberrysystem.api.mapper.ApiRecordMapper;
import com.keraune.vlvblueberrysystem.dto.SiembraForm;
import com.keraune.vlvblueberrysystem.entity.Siembra;
import com.keraune.vlvblueberrysystem.repository.SiembraRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SiembraService {
    private final SiembraRepository siembraRepository;
    private final AccountService accountService;
    private final OperationReferenceService references;
    private final ApiRecordMapper mapper;

    public SiembraService(SiembraRepository siembraRepository, AccountService accountService, OperationReferenceService references, ApiRecordMapper mapper) {
        this.siembraRepository = siembraRepository;
        this.accountService = accountService;
        this.references = references;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<SiembraResponse> list() {
        return siembraRepository.findAllByOrderByFechaSiembraDescIdDesc().stream().map(mapper::siembra).toList();
    }

    public List<SiembraResponse> create(SiembraForm form) {
        Siembra siembra = new Siembra();
        siembra.setUsuarioRegistro(accountService.currentUser());
        apply(siembra, form);
        siembraRepository.save(siembra);
        return list();
    }

    public List<SiembraResponse> update(Long id, SiembraForm form) {
        Siembra siembra = siembraRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Siembra no encontrada"));
        apply(siembra, form);
        return list();
    }

    public List<SiembraResponse> toggleStatus(Long id) {
        Siembra siembra = siembraRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Siembra no encontrada"));
        siembra.setEstado("REGISTRADA".equalsIgnoreCase(siembra.getEstado()) ? "ANULADA" : "REGISTRADA");
        return list();
    }

    public List<SiembraResponse> delete(Long id) {
        siembraRepository.deleteById(id);
        return list();
    }

    private void apply(Siembra siembra, SiembraForm form) {
        siembra.setLote(references.lote(form.loteId()));
        siembra.setCama(references.camaDelLote(form.camaId(), form.loteId()));
        siembra.setFechaSiembra(form.fechaSiembra());
        siembra.setCantidadRegistrada(form.cantidadRegistrada());
        siembra.setObservacion(references.trim(form.observacion()));
        siembra.setEstado(references.clean(form.estado(), "REGISTRADA"));
    }
}
