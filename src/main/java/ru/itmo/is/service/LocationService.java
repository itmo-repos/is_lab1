package ru.itmo.is.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import java.util.List;
import ru.itmo.is.dto.LocationDto;
import ru.itmo.is.model.Location;
import ru.itmo.is.repository.LocationRepository;

@ApplicationScoped
public class LocationService {

    @Inject
    LocationRepository repository;

    @Transactional
    public LocationDto create(LocationDto dto) {
        Location entity = new Location();
        fill(entity, dto);
        repository.save(entity);
        return toDto(entity);
    }

    public LocationDto get(Long id) {
        return toDto(findOrThrow(id));
    }

    public List<LocationDto> list() {
        return repository.findAll().stream().map(this::toDto).toList();
    }

    @Transactional
    public LocationDto update(Long id, LocationDto dto) {
        Location entity = findOrThrow(id);
        fill(entity, dto);
        return toDto(entity);
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(findOrThrow(id));
    }

    private Location findOrThrow(Long id) {
        Location entity = repository.find(id);
        if (entity == null) {
            throw new NotFoundException("Location " + id + " не найдена");
        }
        return entity;
    }

    private void fill(Location entity, LocationDto dto) {
        entity.setX(dto.x());
        entity.setY(dto.y());
        entity.setName(dto.name() == null || dto.name().isBlank() ? null : dto.name());
    }

    private LocationDto toDto(Location entity) {
        return new LocationDto(entity.getId(), entity.getX(), entity.getY(), entity.getName());
    }
}
