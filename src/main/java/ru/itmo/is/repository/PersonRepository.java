package ru.itmo.is.repository;

import jakarta.enterprise.context.ApplicationScoped;
import ru.itmo.is.model.Person;

@ApplicationScoped
public class PersonRepository extends BaseRepository<Person, Long> {

    public PersonRepository() {
        super(Person.class);
    }
}
