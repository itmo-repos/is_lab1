package ru.itmo.is.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import java.util.List;
import ru.itmo.is.dto.CoordinatesDto;
import ru.itmo.is.exception.ConflictException;
import ru.itmo.is.exception.FieldException;
import ru.itmo.is.model.Coordinates;
import ru.itmo.is.model.LabWork;
import ru.itmo.is.repository.CoordinatesRepository;
import ru.itmo.is.repository.LabWorkRepository;

@ApplicationScoped
public class CoordinatesService {

    @Inject
    CoordinatesRepository repository;

    @Inject
    LabWorkRepository labWorkRepository;

    @Transactional
    public CoordinatesDto create(CoordinatesDto dto) {
        Coordinates entity = new Coordinates();
        fill(entity, dto);
        repository.save(entity);
        return toDto(entity);
    }

    public CoordinatesDto get(Long id) {
        return toDto(findOrThrow(id));
    }

    public List<CoordinatesDto> list() {
        return repository.findAll().stream().map(this::toDto).toList();
    }

    @Transactional
    public CoordinatesDto update(Long id, CoordinatesDto dto) {
        Coordinates entity = findOrThrow(id);
        fill(entity, dto);
        return toDto(entity);
    }

    @Transactional
    public void delete(Long id, Long replaceWith) {
        Coordinates entity = findOrThrow(id);
        List<LabWork> labWorks = labWorkRepository.findByCoordinates(entity);
        if (!labWorks.isEmpty()) {
            if (replaceWith == null) {
                throw new ConflictException("Coordinates " + id + " используется в лабораторных ("
                        + labWorks.size() + " шт.), выберите другие координаты для замены");
            }
            if (replaceWith.equals(id)) {
                throw new FieldException("replaceWith", "Нельзя заменить объект на него же");
            }
            Coordinates replacement = findOrThrow(replaceWith);
            labWorks.forEach(labWork -> labWork.setCoordinates(replacement));
        }
        repository.delete(entity);
    }

    private Coordinates findOrThrow(Long id) {
        Coordinates entity = repository.find(id);
        if (entity == null) {
            throw new NotFoundException("Coordinates " + id + " не найдены");
        }
        return entity;
    }

    private void fill(Coordinates entity, CoordinatesDto dto) {
        entity.setX(dto.x());
        entity.setY(dto.y());
    }

    public CoordinatesDto toDto(Coordinates entity) {
        return new CoordinatesDto(entity.getId(), entity.getX(), entity.getY());
    }
}
