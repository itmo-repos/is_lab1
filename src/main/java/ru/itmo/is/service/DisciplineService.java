package ru.itmo.is.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import java.util.List;
import ru.itmo.is.dto.DisciplineDto;
import ru.itmo.is.exception.ConflictException;
import ru.itmo.is.exception.FieldException;
import ru.itmo.is.model.Discipline;
import ru.itmo.is.model.LabWork;
import ru.itmo.is.repository.DisciplineRepository;
import ru.itmo.is.repository.LabWorkRepository;

@ApplicationScoped
public class DisciplineService {

    @Inject
    DisciplineRepository repository;

    @Inject
    LabWorkRepository labWorkRepository;

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
    public void delete(Long id, Long replaceWith) {
        Discipline entity = findOrThrow(id);
        List<LabWork> labWorks = labWorkRepository.findByDiscipline(entity);
        if (!labWorks.isEmpty()) {
            if (replaceWith == null) {
                throw new ConflictException("Discipline " + id + " указана в лабораторных ("
                        + labWorks.size() + " шт.), выберите другую дисциплину для замены");
            }
            if (replaceWith.equals(id)) {
                throw new FieldException("replaceWith", "Нельзя заменить объект на него же");
            }
            Discipline replacement = findOrThrow(replaceWith);
            labWorks.forEach(labWork -> labWork.setDiscipline(replacement));
        }
        repository.delete(entity);
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
