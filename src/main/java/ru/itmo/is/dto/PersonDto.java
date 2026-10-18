package ru.itmo.is.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import ru.itmo.is.model.Color;
import ru.itmo.is.model.Country;

public record PersonDto(
        Long id,
        @NotBlank String name,
        @NotNull Color eyeColor,
        Color hairColor,
        Long locationId,
        @NotNull @Positive Long height,
        @NotNull Country nationality) {
}
