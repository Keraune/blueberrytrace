package com.keraune.vlvblueberrysystem.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record ClasificacionForm(
        @NotNull Long loteId,
        @NotNull Long camaId,
        @NotNull LocalDate fechaClasificacion,
        @NotBlank @Size(max = 60) String estadoPlanta,
        @NotBlank @Size(max = 60) String tamano,
        @NotBlank @Size(max = 120) String condicion,
        @NotNull @Min(1) Integer cantidad,
        @Size(max = 255) String observacion,
        @NotBlank @Size(max = 30) String estado
) {}
