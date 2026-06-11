package com.keraune.vlvblueberrysystem.service;

import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.CamaResponse;
import com.keraune.vlvblueberrysystem.api.mapper.ApiRecordMapper;
import com.keraune.vlvblueberrysystem.dto.CamaForm;
import com.keraune.vlvblueberrysystem.entity.Cama;
import com.keraune.vlvblueberrysystem.repository.CamaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CamaService {
    private final CamaRepository camaRepository;
    private final AccountService accountService;
    private final OperationReferenceService references;
    private final ApiRecordMapper mapper;

    public CamaService(CamaRepository camaRepository, AccountService accountService, OperationReferenceService references, ApiRecordMapper mapper) {
        this.camaRepository = camaRepository;
        this.accountService = accountService;
        this.references = references;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<CamaResponse> list() {
        return camaRepository.findAllByOrderByCodigoAsc().stream().map(mapper::cama).toList();
    }

    public List<CamaResponse> create(CamaForm form) {
        Cama cama = new Cama();
        cama.setUsuarioRegistro(accountService.currentUser());
        apply(cama, form);
        camaRepository.save(cama);
        return list();
    }

    public List<CamaResponse> update(Long id, CamaForm form) {
        Cama cama = camaRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Cama no encontrada"));
        apply(cama, form);
        return list();
    }

    public List<CamaResponse> toggleStatus(Long id) {
        Cama cama = camaRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Cama no encontrada"));
        cama.setEstado("ACTIVA".equalsIgnoreCase(cama.getEstado()) ? "INACTIVA" : "ACTIVA");
        return list();
    }

    private void apply(Cama cama, CamaForm form) {
        cama.setLote(references.lote(form.loteId()));
        cama.setCodigo(form.codigo().trim().toUpperCase());
        cama.setDescripcion(form.descripcion().trim());
        cama.setCapacidadReferencial(form.capacidadReferencial());
        cama.setEstado(form.estado().trim().toUpperCase());
    }
}
