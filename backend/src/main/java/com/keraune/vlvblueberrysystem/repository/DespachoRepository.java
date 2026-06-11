package com.keraune.vlvblueberrysystem.repository;

import com.keraune.vlvblueberrysystem.entity.Despacho;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DespachoRepository extends JpaRepository<Despacho, Long> {
    List<Despacho> findAllByOrderByFechaDespachoDescIdDesc();
    long countByLoteId(Long loteId);
}
