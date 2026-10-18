package ru.itmo.is.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import java.util.List;
import ru.itmo.is.dto.PersonDto;
import ru.itmo.is.model.Location;
import ru.itmo.is.model.Person;
import ru.itmo.is.repository.LocationRepository;
import ru.itmo.is.repository.PersonRepository;

@ApplicationScoped
public class PersonService {

    @Inject
    PersonRepository repository;

    @Inject
    LocationRepository locationRepository;

    @Transactional
    public PersonDto create(PersonDto dto) {
        Person entity = new Person();
        fill(entity, dto);
        repository.save(entity);
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
        return toDto(entity);
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(findOrThrow(id));
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
            throw new ReferenceNotFoundException("locationId", "Location " + locationId + " не найдена");
        }
        return location;
    }

    private PersonDto toDto(Person entity) {
        Location location = entity.getLocation();
        return new PersonDto(entity.getId(), entity.getName(), entity.getEyeColor(),
                entity.getHairColor(), location == null ? null : location.getId(),
                entity.getHeight(), entity.getNationality());
    }
}
