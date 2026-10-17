package ru.itmo.is.repository;

import jakarta.enterprise.context.ApplicationScoped;
import ru.itmo.is.model.LabWork;

@ApplicationScoped
public class LabWorkRepository extends BaseRepository<LabWork, Integer> {

    public LabWorkRepository() {
        super(LabWork.class);
    }
}
