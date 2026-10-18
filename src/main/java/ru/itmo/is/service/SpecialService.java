package ru.itmo.is.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Event;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import java.util.Comparator;
import java.util.List;
import java.util.OptionalDouble;
import java.util.stream.Collectors;
import ru.itmo.is.dto.AverageDto;
import ru.itmo.is.dto.GroupCountDto;
import ru.itmo.is.dto.LabWorkDto;
import ru.itmo.is.event.ChangedEvent;
import ru.itmo.is.exception.FieldException;
import ru.itmo.is.model.Difficulty;
import ru.itmo.is.model.Discipline;
import ru.itmo.is.model.LabWork;
import ru.itmo.is.repository.DisciplineRepository;
import ru.itmo.is.repository.LabWorkRepository;

@ApplicationScoped
public class SpecialService {

    @Inject
    LabWorkRepository labWorkRepository;

    @Inject
    DisciplineRepository disciplineRepository;

    @Inject
    LabWorkService labWorkService;

    @Inject
    Event<ChangedEvent> changes;

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

    @Transactional
    public LabWorkDto decreaseDifficulty(Integer id, Integer steps) {
        if (steps == null || steps <= 0) {
            throw new FieldException("steps", "Число шагов должно быть больше 0");
        }
        LabWork labWork = findLabWork(id);
        int level = Math.max(0, labWork.getDifficulty().ordinal() - steps);
        labWork.setDifficulty(Difficulty.values()[level]);
        changes.fire(new ChangedEvent("labwork"));
        return labWorkService.toDto(labWork);
    }

    @Transactional
    public LabWorkDto removeFromDiscipline(Long disciplineId, Integer labWorkId) {
        Discipline discipline = disciplineRepository.find(disciplineId);
        if (discipline == null) {
            throw new NotFoundException("Discipline " + disciplineId + " не найдена");
        }
        LabWork labWork = findLabWork(labWorkId);
        if (labWork.getDiscipline() == null || !labWork.getDiscipline().getId().equals(disciplineId)) {
            throw new FieldException("labWorkId",
                    "LabWork " + labWorkId + " не входит в программу дисциплины " + disciplineId);
        }
        labWork.setDiscipline(null);
        changes.fire(new ChangedEvent("labwork"));
        return labWorkService.toDto(labWork);
    }

    private LabWork findLabWork(Integer id) {
        LabWork labWork = labWorkRepository.find(id);
        if (labWork == null) {
            throw new NotFoundException("LabWork " + id + " не найден");
        }
        return labWork;
    }
}
