package ru.itmo.is.service;

public class ReferenceNotFoundException extends RuntimeException {

    private final String field;

    public ReferenceNotFoundException(String field, String message) {
        super(message);
        this.field = field;
    }

    public String getField() {
        return field;
    }
}
