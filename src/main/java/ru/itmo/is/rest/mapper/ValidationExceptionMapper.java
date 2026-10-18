package ru.itmo.is.rest.mapper;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Path;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import java.util.List;
import java.util.Map;
import ru.itmo.is.dto.FieldErrorDto;

@Provider
public class ValidationExceptionMapper implements ExceptionMapper<ConstraintViolationException> {

    @Override
    public Response toResponse(ConstraintViolationException e) {
        List<FieldErrorDto> errors = e.getConstraintViolations().stream()
                .map(v -> new FieldErrorDto(fieldName(v), v.getMessage()))
                .toList();
        return Response.status(Response.Status.BAD_REQUEST)
                .type(MediaType.APPLICATION_JSON)
                .entity(Map.of("errors", errors))
                .build();
    }

    private String fieldName(ConstraintViolation<?> violation) {
        String name = "";
        for (Path.Node node : violation.getPropertyPath()) {
            name = node.getName();
        }
        return name;
    }
}
