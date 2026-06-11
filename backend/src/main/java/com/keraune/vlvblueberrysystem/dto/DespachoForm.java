package com.keraune.vlvblueberrysystem.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record DespachoForm(
        @NotNull Long loteId,
        @NotNull LocalDate fechaDespacho,
        @NotBlank @Size(max = 80) String modalidad,
        @NotNull @Min(1) Integer cantidadDespachada,
        @Size(max = 120) String destino,
        @Size(max = 80) String guiaRemision,
        @NotBlank @Size(max = 120) String validacionCalidad,
        @Size(max = 255) String observacion,
        @NotBlank @Size(max = 30) String estado
) {}
