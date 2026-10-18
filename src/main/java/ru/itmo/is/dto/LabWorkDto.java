package ru.itmo.is.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.ZonedDateTime;
import ru.itmo.is.model.Difficulty;

public record LabWorkDto(
        Integer id,
        @NotBlank String name,
        @NotNull Long coordinatesId,
        ZonedDateTime creationDate,
        @NotNull String description,
        @NotNull Difficulty difficulty,
        Long disciplineId,
        @Positive Float minimalPoint,
        @Positive Long personalQualitiesMinimum,
        @NotNull Long authorId) {
}
