package ru.itmo.is.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DisciplineDto(
        Long id,
        @NotBlank String name,
        @NotNull Integer practiceHours,
        @NotNull Integer labsCount) {
}
