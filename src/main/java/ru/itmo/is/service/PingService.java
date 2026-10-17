package ru.itmo.is.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import ru.itmo.is.repository.PingRepository;

@ApplicationScoped
public class PingService {

    @Inject
    private PingRepository repo;

    public int selectOne() {
        return repo.selectOne();
    }
}
