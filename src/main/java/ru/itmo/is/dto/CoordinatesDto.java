package ru.itmo.is.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;

public record CoordinatesDto(
        Long id,
        @NotNull @Max(577) Long x,
        @NotNull Double y) {
}
