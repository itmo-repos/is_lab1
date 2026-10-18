package ru.itmo.is.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Event;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import java.util.List;
import ru.itmo.is.dto.LocationDto;
import ru.itmo.is.event.ChangedEvent;
import ru.itmo.is.model.Location;
import ru.itmo.is.repository.LocationRepository;

@ApplicationScoped
public class LocationService {

    @Inject
    LocationRepository repository;

    @Inject
    Event<ChangedEvent> changes;

    @Transactional
    public LocationDto create(LocationDto dto) {
        Location entity = new Location();
        fill(entity, dto);
        repository.save(entity);
        changes.fire(new ChangedEvent("location"));
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
        changes.fire(new ChangedEvent("location"));
        return toDto(entity);
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(findOrThrow(id));
        changes.fire(new ChangedEvent("location"));
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

    public LocationDto toDto(Location entity) {
        return new LocationDto(entity.getId(), entity.getX(), entity.getY(), entity.getName());
    }
}
