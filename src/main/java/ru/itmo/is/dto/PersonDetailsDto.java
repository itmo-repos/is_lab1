package ru.itmo.is.dto;

import ru.itmo.is.model.Color;
import ru.itmo.is.model.Country;

public record PersonDetailsDto(
        Long id,
        String name,
        Color eyeColor,
        Color hairColor,
        LocationDto location,
        Long height,
        Country nationality) {
}
