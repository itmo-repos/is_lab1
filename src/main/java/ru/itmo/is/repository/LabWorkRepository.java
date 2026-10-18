package ru.itmo.is.repository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.From;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import ru.itmo.is.model.Coordinates;
import ru.itmo.is.model.Discipline;
import ru.itmo.is.model.LabWork;
import ru.itmo.is.model.Person;

@ApplicationScoped
public class LabWorkRepository extends BaseRepository<LabWork, Integer> {

    public static final Set<String> FILTERABLE = Set.of(
            "name", "description", "difficulty",
            "discipline.name",
            "author.name", "author.eyeColor", "author.hairColor", "author.nationality",
            "author.location.name");

    public static final Set<String> SORTABLE = Set.of(
            "id", "name", "coordinates.x", "coordinates.y", "creationDate", "description",
            "difficulty", "discipline.name", "discipline.practiceHours", "discipline.labsCount",
            "minimalPoint", "personalQualitiesMinimum",
            "author.name", "author.eyeColor", "author.hairColor", "author.height",
            "author.nationality", "author.location.x", "author.location.y", "author.location.name");

    public LabWorkRepository() {
        super(LabWork.class);
    }

    public List<LabWork> findPage(Map<String, String> filters, String sort, boolean ascending,
                                  int page, int size) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<LabWork> query = cb.createQuery(LabWork.class);
        Root<LabWork> root = query.from(LabWork.class);
        Path<?> sortPath = path(root, sort);
        query.select(root)
                .where(predicates(cb, root, filters))
                .orderBy(ascending ? cb.asc(sortPath) : cb.desc(sortPath), cb.asc(root.get("id")));
        return em.createQuery(query)
                .setFirstResult(page * size)
                .setMaxResults(size)
                .getResultList();
    }

    public List<LabWork> findByAuthor(Person author) {
        return em.createQuery("SELECT l FROM LabWork l WHERE l.author = :author", LabWork.class)
                .setParameter("author", author)
                .getResultList();
    }

    public List<LabWork> findByCoordinates(Coordinates coordinates) {
        return em.createQuery("SELECT l FROM LabWork l WHERE l.coordinates = :coordinates", LabWork.class)
                .setParameter("coordinates", coordinates)
                .getResultList();
    }

    public List<LabWork> findByDiscipline(Discipline discipline) {
        return em.createQuery("SELECT l FROM LabWork l WHERE l.discipline = :discipline", LabWork.class)
                .setParameter("discipline", discipline)
                .getResultList();
    }

    public long count(Map<String, String> filters) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Long> query = cb.createQuery(Long.class);
        Root<LabWork> root = query.from(LabWork.class);
        query.select(cb.count(root)).where(predicates(cb, root, filters));
        return em.createQuery(query).getSingleResult();
    }

    private Predicate[] predicates(CriteriaBuilder cb, Root<LabWork> root, Map<String, String> filters) {
        List<Predicate> result = new ArrayList<>();
        filters.forEach((column, value) -> result.add(equalTo(cb, path(root, column), value)));
        return result.toArray(new Predicate[0]);
    }

    @SuppressWarnings({"unchecked", "rawtypes"})
    private Predicate equalTo(CriteriaBuilder cb, Path<?> path, String value) {
        Class<?> type = path.getJavaType();
        if (type.isEnum()) {
            try {
                return cb.equal(path, Enum.valueOf((Class) type, value));
            } catch (IllegalArgumentException e) {
                return cb.disjunction();
            }
        }
        return cb.equal(path, value);
    }

    private Path<?> path(Root<LabWork> root, String column) {
        String[] parts = column.split("\\.");
        From<?, ?> from = root;
        for (int i = 0; i < parts.length - 1; i++) {
            from = join(from, parts[i]);
        }
        return from.get(parts[parts.length - 1]);
    }

    private Join<?, ?> join(From<?, ?> from, String attribute) {
        for (Join<?, ?> existing : from.getJoins()) {
            if (existing.getAttribute().getName().equals(attribute)) {
                return existing;
            }
        }
        return from.join(attribute, JoinType.LEFT);
    }
}
