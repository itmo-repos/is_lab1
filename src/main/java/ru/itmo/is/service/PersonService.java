package ru.itmo.is.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Event;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import java.util.List;
import ru.itmo.is.dto.PersonDetailsDto;
import ru.itmo.is.dto.PersonDto;
import ru.itmo.is.event.ChangedEvent;
import ru.itmo.is.exception.ConflictException;
import ru.itmo.is.exception.FieldException;
import ru.itmo.is.model.LabWork;
import ru.itmo.is.model.Location;
import ru.itmo.is.model.Person;
import ru.itmo.is.repository.LabWorkRepository;
import ru.itmo.is.repository.LocationRepository;
import ru.itmo.is.repository.PersonRepository;

@ApplicationScoped
public class PersonService {

    @Inject
    PersonRepository repository;

    @Inject
    LocationRepository locationRepository;

    @Inject
    LabWorkRepository labWorkRepository;

    @Inject
    LocationService locationService;

    @Inject
    Event<ChangedEvent> changes;

    @Transactional
    public PersonDto create(PersonDto dto) {
        Person entity = new Person();
        fill(entity, dto);
        repository.save(entity);
        changes.fire(new ChangedEvent("person"));
        return toDto(entity);
    }

    public PersonDto get(Long id) {
        return toDto(findOrThrow(id));
    }

    public List<PersonDto> list() {
        return repository.findAll().stream().map(this::toDto).toList();
    }

    @Transactional
    public PersonDto update(Long id, PersonDto dto) {
        Person entity = findOrThrow(id);
        fill(entity, dto);
        changes.fire(new ChangedEvent("person"));
        return toDto(entity);
    }

    @Transactional
    public void delete(Long id, Long replaceWith) {
        Person entity = findOrThrow(id);
        List<LabWork> labWorks = labWorkRepository.findByAuthor(entity);
        if (!labWorks.isEmpty()) {
            if (replaceWith == null) {
                throw new ConflictException("Person " + id + " указан автором в лабораторных ("
                        + labWorks.size() + " шт.), выберите другого автора для замены");
            }
            if (replaceWith.equals(id)) {
                throw new FieldException("replaceWith", "Нельзя заменить автора на него же");
            }
            Person replacement = findOrThrow(replaceWith);
            labWorks.forEach(labWork -> labWork.setAuthor(replacement));
            changes.fire(new ChangedEvent("labwork"));
        }
        repository.delete(entity);
        changes.fire(new ChangedEvent("person"));
    }

    private Person findOrThrow(Long id) {
        Person entity = repository.find(id);
        if (entity == null) {
            throw new NotFoundException("Person " + id + " не найден");
        }
        return entity;
    }

    private void fill(Person entity, PersonDto dto) {
        entity.setName(dto.name());
        entity.setEyeColor(dto.eyeColor());
        entity.setHairColor(dto.hairColor());
        entity.setLocation(findLocation(dto.locationId()));
        entity.setHeight(dto.height());
        entity.setNationality(dto.nationality());
    }

    private Location findLocation(Long locationId) {
        if (locationId == null) {
            return null;
        }
        Location location = locationRepository.find(locationId);
        if (location == null) {
            throw new FieldException("locationId", "Location " + locationId + " не найдена");
        }
        return location;
    }

    public PersonDto toDto(Person entity) {
        Location location = entity.getLocation();
        return new PersonDto(entity.getId(), entity.getName(), entity.getEyeColor(),
                entity.getHairColor(), location == null ? null : location.getId(),
                entity.getHeight(), entity.getNationality());
    }

    public PersonDetailsDto toDetailsDto(Person entity) {
        Location location = entity.getLocation();
        return new PersonDetailsDto(entity.getId(), entity.getName(), entity.getEyeColor(),
                entity.getHairColor(), location == null ? null : locationService.toDto(location),
                entity.getHeight(), entity.getNationality());
    }
}
