package ru.itmo.is.rest;

import jakarta.json.bind.JsonbException;
import jakarta.ws.rs.ProcessingException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import java.util.List;
import java.util.Map;
import ru.itmo.is.dto.FieldErrorDto;

@Provider
public class JsonExceptionMapper implements ExceptionMapper<ProcessingException> {

    private static final String ENUM_PREFIX = "No enum constant ";

    @Override
    public Response toResponse(ProcessingException e) {
        if (!hasJsonCause(e)) {
            return Response.serverError().build();
        }
        return Response.status(Response.Status.BAD_REQUEST)
                .type(MediaType.APPLICATION_JSON)
                .entity(Map.of("errors", List.of(new FieldErrorDto("body", describe(e)))))
                .build();
    }

    private boolean hasJsonCause(Throwable e) {
        for (Throwable t = e; t != null; t = t.getCause()) {
            if (t instanceof JsonbException) {
                return true;
            }
        }
        return false;
    }

    private String describe(Throwable e) {
        Throwable root = e;
        while (root.getCause() != null) {
            root = root.getCause();
        }
        String message = root.getMessage();
        if (message != null && message.startsWith(ENUM_PREFIX)) {
            return "Недопустимое значение: " + message.substring(message.lastIndexOf('.') + 1);
        }
        return "Некорректный JSON";
    }
}
