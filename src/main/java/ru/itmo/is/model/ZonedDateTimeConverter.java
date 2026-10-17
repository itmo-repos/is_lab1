package ru.itmo.is.model;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;

@Converter
public class ZonedDateTimeConverter implements AttributeConverter<ZonedDateTime, OffsetDateTime> {

    @Override
    public OffsetDateTime convertToDatabaseColumn(ZonedDateTime value) {
        return value == null ? null : value.toOffsetDateTime();
    }

    @Override
    public ZonedDateTime convertToEntityAttribute(OffsetDateTime value) {
        return value == null ? null : value.atZoneSameInstant(ZoneOffset.UTC);
    }
}
