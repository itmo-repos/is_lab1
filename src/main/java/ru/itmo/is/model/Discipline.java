package ru.itmo.is.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "is_lab1_discipline")
public class Discipline {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "practice_hours", nullable = false)
    private int practiceHours;

    @Column(name = "labs_count", nullable = false)
    private int labsCount;

    public Discipline() {
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getPracticeHours() {
        return practiceHours;
    }

    public void setPracticeHours(int practiceHours) {
        this.practiceHours = practiceHours;
    }

    public int getLabsCount() {
        return labsCount;
    }

    public void setLabsCount(int labsCount) {
        this.labsCount = labsCount;
    }
}
