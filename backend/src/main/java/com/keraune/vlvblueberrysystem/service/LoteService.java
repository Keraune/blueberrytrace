package com.keraune.vlvblueberrysystem.service;

import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.LoteResponse;
import com.keraune.vlvblueberrysystem.api.mapper.ApiRecordMapper;
import com.keraune.vlvblueberrysystem.dto.LoteForm;
import com.keraune.vlvblueberrysystem.entity.Lote;
import com.keraune.vlvblueberrysystem.repository.LoteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class LoteService {
    private final LoteRepository loteRepository;
    private final AccountService accountService;
    private final ApiRecordMapper mapper;

    public LoteService(LoteRepository loteRepository, AccountService accountService, ApiRecordMapper mapper) {
        this.loteRepository = loteRepository;
        this.accountService = accountService;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<LoteResponse> list() {
        return loteRepository.findAllByOrderByFechaRegistroDescIdDesc().stream().map(mapper::lote).toList();
    }

    public List<LoteResponse> create(LoteForm form) {
        Lote lote = new Lote();
        lote.setUsuarioRegistro(accountService.currentUser());
        apply(lote, form);
        loteRepository.save(lote);
        return list();
    }

    public List<LoteResponse> update(Long id, LoteForm form) {
        Lote lote = loteRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Lote no encontrado"));
        apply(lote, form);
        return list();
    }

    public List<LoteResponse> toggleStatus(Long id) {
        Lote lote = loteRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Lote no encontrado"));
        lote.setEstado("ACTIVO".equalsIgnoreCase(lote.getEstado()) ? "INACTIVO" : "ACTIVO");
        return list();
    }

    public List<LoteResponse> delete(Long id) {
        loteRepository.deleteById(id);
        return list();
    }

    private void apply(Lote lote, LoteForm form) {
        lote.setCodigo(form.codigo().trim().toUpperCase());
        lote.setDescripcion(form.descripcion().trim());
        lote.setCultivo(form.cultivo() == null ? null : form.cultivo().trim());
        lote.setVariedad(form.variedad() == null ? null : form.variedad().trim());
        lote.setFechaRegistro(form.fechaRegistro());
        lote.setObservacion(form.observacion() == null ? null : form.observacion().trim());
        lote.setEstado(form.estado().trim().toUpperCase());
    }
}
