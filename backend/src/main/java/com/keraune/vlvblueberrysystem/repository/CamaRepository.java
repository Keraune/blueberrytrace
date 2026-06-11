package com.keraune.vlvblueberrysystem.repository;

import com.keraune.vlvblueberrysystem.entity.Cama;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CamaRepository extends JpaRepository<Cama, Long> {
    List<Cama> findAllByOrderByCodigoAsc();
    long countByEstadoIgnoreCase(String estado);
}
