package com.keraune.vlvblueberrysystem.repository;

import com.keraune.vlvblueberrysystem.entity.Cama;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CamaRepository extends JpaRepository<Cama, Long> {
    Optional<Cama> findByCodigo(String codigo);
    List<Cama> findAllByOrderByCodigoAsc();
}
