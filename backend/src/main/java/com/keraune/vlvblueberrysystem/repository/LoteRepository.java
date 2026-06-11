package com.keraune.vlvblueberrysystem.repository;

import com.keraune.vlvblueberrysystem.entity.Lote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoteRepository extends JpaRepository<Lote, Long> {
    List<Lote> findAllByOrderByFechaRegistroDescIdDesc();
    long countByEstadoIgnoreCase(String estado);
}
