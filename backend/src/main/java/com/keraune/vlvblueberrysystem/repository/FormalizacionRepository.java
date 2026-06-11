package com.keraune.vlvblueberrysystem.repository;

import com.keraune.vlvblueberrysystem.entity.Formalizacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FormalizacionRepository extends JpaRepository<Formalizacion, Long> {
    List<Formalizacion> findAllByOrderByFechaFormalizacionDescIdDesc();
    long countByLoteId(Long loteId);
}
