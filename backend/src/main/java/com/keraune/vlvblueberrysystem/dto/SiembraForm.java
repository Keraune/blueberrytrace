package com.keraune.vlvblueberrysystem.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record SiembraForm(
        @NotNull Long loteId,
        @NotNull Long camaId,
        @NotNull LocalDate fechaSiembra,
        @NotNull @Min(1) Integer cantidadRegistrada,
        @Size(max = 255) String observacion,
        @NotBlank @Size(max = 30) String estado
) {}
