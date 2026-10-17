package ru.itmo.is.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import java.util.List;
import ru.itmo.is.dto.CoordinatesDto;
import ru.itmo.is.model.Coordinates;
import ru.itmo.is.repository.CoordinatesRepository;

@ApplicationScoped
public class CoordinatesService {

    @Inject
    CoordinatesRepository repository;

    @Transactional
    public CoordinatesDto create(CoordinatesDto dto) {
        Coordinates entity = new Coordinates();
        entity.setX(dto.x());
        entity.setY(dto.y());
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
        entity.setX(dto.x());
        entity.setY(dto.y());
        return toDto(entity);
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(findOrThrow(id));
    }

    private Coordinates findOrThrow(Long id) {
        Coordinates entity = repository.find(id);
        if (entity == null) {
            throw new NotFoundException("Coordinates " + id + " не найдены");
        }
        return entity;
    }

    private CoordinatesDto toDto(Coordinates entity) {
        return new CoordinatesDto(entity.getId(), entity.getX(), entity.getY());
    }
}
