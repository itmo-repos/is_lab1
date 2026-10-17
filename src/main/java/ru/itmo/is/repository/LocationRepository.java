package ru.itmo.is.repository;

import jakarta.enterprise.context.ApplicationScoped;
import ru.itmo.is.model.Location;

@ApplicationScoped
public class LocationRepository extends BaseRepository<Location, Long> {

    public LocationRepository() {
        super(Location.class);
    }
}
