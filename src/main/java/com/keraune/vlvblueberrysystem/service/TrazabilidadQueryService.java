package com.keraune.vlvblueberrysystem.service;

import com.keraune.vlvblueberrysystem.entity.Lote;
import com.keraune.vlvblueberrysystem.repository.LoteRepository;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TrazabilidadQueryService {

    private final LoteRepository loteRepository;

    public TrazabilidadQueryService(LoteRepository loteRepository) {
        this.loteRepository = loteRepository;
    }

    @Transactional(readOnly = true)
    public List<Lote> buscar(String codigo, String variedad, LocalDate fechaRegistro) {
        List<Lote> lotes = new ArrayList<>(loteRepository.findAll());

        if (fechaRegistro != null) {
            lotes.removeIf(lote -> lote.getFechaRegistro() == null || !fechaRegistro.equals(lote.getFechaRegistro()));
        }

        if (variedad != null && !variedad.isBlank()) {
            String variedadNormalizada = normalizar(variedad);
            lotes.removeIf(lote -> lote.getVariedad() == null
                    || !normalizar(lote.getVariedad()).contains(variedadNormalizada));
        }

        lotes.sort(Comparator
                .comparing(Lote::getFechaRegistro, Comparator.nullsLast(Comparator.reverseOrder()))
                .thenComparing(Lote::getCodigo, Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)));

        if (codigo != null && !codigo.isBlank()) {
            String codigoNormalizado = normalizar(codigo).toUpperCase(Locale.ROOT);
            List<Lote> ordenadosPorCodigo = new ArrayList<>(lotes);
            ordenadosPorCodigo.sort(Comparator.comparing(
                    lote -> lote.getCodigo() == null ? "" : lote.getCodigo().toUpperCase(Locale.ROOT)));

            int index = busquedaBinariaPorCodigo(ordenadosPorCodigo, codigoNormalizado);
            if (index < 0) {
                return List.of();
            }

            String codigoEncontrado = ordenadosPorCodigo.get(index).getCodigo();
            List<Lote> coincidencias = new ArrayList<>();
            for (Lote lote : lotes) {
                if (lote.getCodigo() != null && lote.getCodigo().equalsIgnoreCase(codigoEncontrado)) {
                    coincidencias.add(lote);
                }
            }
            return coincidencias;
        }

        return lotes;
    }

    private int busquedaBinariaPorCodigo(List<Lote> lotes, String codigoBuscado) {
        int izquierda = 0;
        int derecha = lotes.size() - 1;

        while (izquierda <= derecha) {
            int medio = (izquierda + derecha) >>> 1;
            String codigoActual = lotes.get(medio).getCodigo() == null
                    ? ""
                    : lotes.get(medio).getCodigo().toUpperCase(Locale.ROOT);

            int comparacion = codigoActual.compareTo(codigoBuscado);
            if (comparacion == 0) {
                return medio;
            }
            if (comparacion < 0) {
                izquierda = medio + 1;
            } else {
                derecha = medio - 1;
            }
        }
        return -1;
    }

    private String normalizar(String valor) {
        return valor == null ? "" : valor.trim().toLowerCase(Locale.ROOT);
    }
}
