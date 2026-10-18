package ru.itmo.is.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.Comparator;
import java.util.List;
import java.util.OptionalDouble;
import java.util.stream.Collectors;
import ru.itmo.is.dto.AverageDto;
import ru.itmo.is.dto.GroupCountDto;
import ru.itmo.is.dto.LabWorkDto;
import ru.itmo.is.exception.FieldException;
import ru.itmo.is.model.LabWork;
import ru.itmo.is.repository.LabWorkRepository;

@ApplicationScoped
public class SpecialService {

    @Inject
    LabWorkRepository labWorkRepository;

    @Inject
    LabWorkService labWorkService;

    public AverageDto averageMinimalPoint() {
        OptionalDouble average = labWorkRepository.findAll().stream()
                .map(LabWork::getMinimalPoint)
                .filter(point -> point != null)
                .mapToDouble(Float::doubleValue)
                .average();
        return new AverageDto(average.isPresent() ? average.getAsDouble() : null);
    }

    public List<GroupCountDto> groupById() {
        return labWorkRepository.findAll().stream()
                .collect(Collectors.groupingBy(LabWork::getId, Collectors.counting()))
                .entrySet().stream()
                .map(entry -> new GroupCountDto(entry.getKey(), entry.getValue()))
                .sorted(Comparator.comparing(GroupCountDto::id))
                .toList();
    }

    public List<LabWorkDto> minimalPointGreater(Float value) {
        if (value == null) {
            throw new FieldException("value", "Укажите value");
        }
        return labWorkRepository.findAll().stream()
                .filter(labWork -> labWork.getMinimalPoint() != null
                        && labWork.getMinimalPoint() > value)
                .map(labWorkService::toDto)
                .toList();
    }
}
