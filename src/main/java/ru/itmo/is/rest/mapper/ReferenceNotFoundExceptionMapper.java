package ru.itmo.is.rest.mapper;

import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import java.util.List;
import java.util.Map;
import ru.itmo.is.dto.FieldErrorDto;
import ru.itmo.is.service.ReferenceNotFoundException;

@Provider
public class ReferenceNotFoundExceptionMapper implements ExceptionMapper<ReferenceNotFoundException> {

    @Override
    public Response toResponse(ReferenceNotFoundException e) {
        return Response.status(Response.Status.BAD_REQUEST)
                .type(MediaType.APPLICATION_JSON)
                .entity(Map.of("errors", List.of(new FieldErrorDto(e.getField(), e.getMessage()))))
                .build();
    }
}
