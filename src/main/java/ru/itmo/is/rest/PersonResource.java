package ru.itmo.is.rest;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import ru.itmo.is.dto.PersonDto;
import ru.itmo.is.service.PersonService;

@Path("/persons")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RequestScoped
public class PersonResource {

    @Inject
    PersonService service;

    @POST
    public Response create(@Valid PersonDto dto) {
        return Response.status(Response.Status.CREATED).entity(service.create(dto)).build();
    }

    @GET
    public List<PersonDto> list() {
        return service.list();
    }

    @GET
    @Path("/{id}")
    public PersonDto get(@PathParam("id") Long id) {
        return service.get(id);
    }

    @PUT
    @Path("/{id}")
    public PersonDto update(@PathParam("id") Long id, @Valid PersonDto dto) {
        return service.update(id, dto);
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        service.delete(id);
        return Response.noContent().build();
    }
}
