package com.keraune.vlvblueberrysystem.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record FormalizacionForm(
        @NotNull Long loteId,
        @NotNull Long camaId,
        @NotNull LocalDate fechaFormalizacion,
        @NotBlank @Size(max = 180) String detalle,
        @NotNull @Min(0) Integer cantidadBandejas,
        @NotNull @Min(0) Integer cantidadPlantas,
        @Size(max = 255) String observacion,
        @NotBlank @Size(max = 30) String estado
) {}
