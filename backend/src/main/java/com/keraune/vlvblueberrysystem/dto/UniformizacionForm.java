package com.keraune.vlvblueberrysystem.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record UniformizacionForm(
        @NotNull Long loteId,
        @NotNull Long camaId,
        @NotNull LocalDate fechaUniformizacion,
        @NotBlank @Size(max = 120) String criterio,
        @NotNull @Min(0) Integer cantidadInicial,
        @NotNull @Min(0) Integer cantidadUniformizada,
        @Size(max = 255) String observacion,
        @NotBlank @Size(max = 30) String estado
) {}
