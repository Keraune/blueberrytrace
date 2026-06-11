package com.keraune.vlvblueberrysystem.repository;

import com.keraune.vlvblueberrysystem.entity.Uniformizacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UniformizacionRepository extends JpaRepository<Uniformizacion, Long> {
    List<Uniformizacion> findAllByOrderByFechaUniformizacionDescIdDesc();
    long countByLoteId(Long loteId);
}
