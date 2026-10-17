-- PostgreSQL

DROP TABLE IF EXISTS is_lab1_lab_work CASCADE;
DROP TABLE IF EXISTS is_lab1_person CASCADE;
DROP TABLE IF EXISTS is_lab1_location CASCADE;
DROP TABLE IF EXISTS is_lab1_discipline CASCADE;
DROP TABLE IF EXISTS is_lab1_coordinates CASCADE;

CREATE TABLE is_lab1_coordinates (
    id BIGSERIAL PRIMARY KEY,
    x  BIGINT           NOT NULL CHECK (x <= 577),
    y  DOUBLE PRECISION NOT NULL
);

CREATE TABLE is_lab1_discipline (
    id             BIGSERIAL PRIMARY KEY,
    name           VARCHAR(255) NOT NULL CHECK (length(trim(name)) > 0),
    practice_hours INTEGER NOT NULL,
    labs_count     INTEGER NOT NULL
);

CREATE TABLE is_lab1_location (
    id   BIGSERIAL PRIMARY KEY,
    x    INTEGER NOT NULL,
    y    BIGINT  NOT NULL,
    name VARCHAR(255) CHECK (name IS NULL OR length(trim(name)) > 0)
);

CREATE TABLE is_lab1_person (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL CHECK (length(trim(name)) > 0),
    eye_color   VARCHAR(16) NOT NULL CHECK (eye_color IN ('GREEN', 'BLUE', 'WHITE', 'BROWN')),
    hair_color  VARCHAR(16) CHECK (hair_color IN ('GREEN', 'BLUE', 'WHITE', 'BROWN')),
    location_id BIGINT REFERENCES is_lab1_location (id) ON DELETE SET NULL,
    height      BIGINT NOT NULL CHECK (height > 0),
    nationality VARCHAR(32) NOT NULL CHECK (nationality IN ('UNITED_KINGDOM', 'USA', 'VATICAN'))
);

CREATE TABLE is_lab1_lab_work (
    id                        SERIAL PRIMARY KEY,
    name                      VARCHAR(255) NOT NULL CHECK (length(trim(name)) > 0),
    coordinates_id            BIGINT NOT NULL REFERENCES is_lab1_coordinates (id),
    creation_date             TIMESTAMPTZ NOT NULL DEFAULT now(),
    description               TEXT NOT NULL,
    difficulty                VARCHAR(16) NOT NULL CHECK (difficulty IN ('HARD', 'VERY_HARD', 'IMPOSSIBLE', 'INSANE')),
    discipline_id             BIGINT REFERENCES is_lab1_discipline (id) ON DELETE SET NULL,
    minimal_point             REAL    CHECK (minimal_point > 0),
    personal_qualities_minimum BIGINT CHECK (personal_qualities_minimum > 0),
    author_id                 BIGINT NOT NULL REFERENCES is_lab1_person (id)
);

CREATE INDEX is_lab1_idx_lab_work_discipline ON is_lab1_lab_work (discipline_id);
CREATE INDEX is_lab1_idx_lab_work_author ON is_lab1_lab_work (author_id);
