package ru.itmo.is.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import java.util.List;
import ru.itmo.is.dto.DisciplineDto;
import ru.itmo.is.model.Discipline;
import ru.itmo.is.repository.DisciplineRepository;

@ApplicationScoped
public class DisciplineService {

    @Inject
    DisciplineRepository repository;

    @Transactional
    public DisciplineDto create(DisciplineDto dto) {
        Discipline entity = new Discipline();
        fill(entity, dto);
        repository.save(entity);
        return toDto(entity);
    }

    public DisciplineDto get(Long id) {
        return toDto(findOrThrow(id));
    }

    public List<DisciplineDto> list() {
        return repository.findAll().stream().map(this::toDto).toList();
    }

    @Transactional
    public DisciplineDto update(Long id, DisciplineDto dto) {
        Discipline entity = findOrThrow(id);
        fill(entity, dto);
        return toDto(entity);
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(findOrThrow(id));
    }

    private Discipline findOrThrow(Long id) {
        Discipline entity = repository.find(id);
        if (entity == null) {
            throw new NotFoundException("Discipline " + id + " не найдена");
        }
        return entity;
    }

    private void fill(Discipline entity, DisciplineDto dto) {
        entity.setName(dto.name());
        entity.setPracticeHours(dto.practiceHours());
        entity.setLabsCount(dto.labsCount());
    }

    public DisciplineDto toDto(Discipline entity) {
        return new DisciplineDto(entity.getId(), entity.getName(),
                entity.getPracticeHours(), entity.getLabsCount());
    }
}
