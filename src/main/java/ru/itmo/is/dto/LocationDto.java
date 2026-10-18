package ru.itmo.is.dto;

import jakarta.validation.constraints.NotNull;

public record LocationDto(
        Long id,
        @NotNull Integer x,
        @NotNull Long y,
        String name) {
}
