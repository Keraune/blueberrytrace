package com.keraune.vlvblueberrysystem.repository;

import com.keraune.vlvblueberrysystem.entity.Siembra;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SiembraRepository extends JpaRepository<Siembra, Long> {
    List<Siembra> findAllByOrderByFechaSiembraDescIdDesc();
    long countByLoteId(Long loteId);
    long countByCamaId(Long camaId);
}
