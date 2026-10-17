package ru.itmo.is.repository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@ApplicationScoped
public class PingRepository {

    @PersistenceContext(unitName = "lab1")
    private EntityManager em;

    public int selectOne() {
        return ((Number) em.createNativeQuery("SELECT 1").getSingleResult()).intValue();
    }
}
