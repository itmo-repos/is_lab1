package ru.itmo.is.dto;

import java.time.ZonedDateTime;
import ru.itmo.is.model.Difficulty;

public record LabWorkDetailsDto(
        Integer id,
        String name,
        CoordinatesDto coordinates,
        ZonedDateTime creationDate,
        String description,
        Difficulty difficulty,
        DisciplineDto discipline,
        Float minimalPoint,
        Long personalQualitiesMinimum,
        PersonDetailsDto author) {
}
