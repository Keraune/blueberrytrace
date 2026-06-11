package com.keraune.vlvblueberrysystem.service;

import com.keraune.vlvblueberrysystem.entity.Cama;
import com.keraune.vlvblueberrysystem.entity.Lote;
import com.keraune.vlvblueberrysystem.repository.CamaRepository;
import com.keraune.vlvblueberrysystem.repository.LoteRepository;
import org.springframework.stereotype.Service;

@Service
public class OperationReferenceService {
    private final LoteRepository loteRepository;
    private final CamaRepository camaRepository;

    public OperationReferenceService(LoteRepository loteRepository, CamaRepository camaRepository) {
        this.loteRepository = loteRepository;
        this.camaRepository = camaRepository;
    }

    public Lote lote(Long id) {
        return loteRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Lote no encontrado"));
    }

    public Cama cama(Long id) {
        return camaRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Cama no encontrada"));
    }

    public Cama camaDelLote(Long camaId, Long loteId) {
        Cama cama = cama(camaId);
        if (cama.getLote() == null || !cama.getLote().getId().equals(loteId)) {
            throw new IllegalArgumentException("La cama seleccionada no pertenece al lote indicado.");
        }
        return cama;
    }

    public String clean(String value, String fallback) {
        if (value == null || value.isBlank()) return fallback;
        return value.trim().toUpperCase();
    }

    public String trim(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
