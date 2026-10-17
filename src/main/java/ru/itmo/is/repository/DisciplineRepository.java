package ru.itmo.is.repository;

import jakarta.enterprise.context.ApplicationScoped;
import ru.itmo.is.model.Discipline;

@ApplicationScoped
public class DisciplineRepository extends BaseRepository<Discipline, Long> {

    public DisciplineRepository() {
        super(Discipline.class);
    }
}
