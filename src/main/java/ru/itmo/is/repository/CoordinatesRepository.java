package ru.itmo.is.repository;

import jakarta.enterprise.context.ApplicationScoped;
import ru.itmo.is.model.Coordinates;

@ApplicationScoped
public class CoordinatesRepository extends BaseRepository<Coordinates, Long> {

    public CoordinatesRepository() {
        super(Coordinates.class);
    }
}
