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
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import ru.itmo.is.dto.DisciplineDto;
import ru.itmo.is.service.DisciplineService;

@Path("/disciplines")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RequestScoped
public class DisciplineResource {

    @Inject
    DisciplineService service;

    @POST
    public Response create(@Valid DisciplineDto dto) {
        return Response.status(Response.Status.CREATED).entity(service.create(dto)).build();
    }

    @GET
    public List<DisciplineDto> list() {
        return service.list();
    }

    @GET
    @Path("/{id}")
    public DisciplineDto get(@PathParam("id") Long id) {
        return service.get(id);
    }

    @PUT
    @Path("/{id}")
    public DisciplineDto update(@PathParam("id") Long id, @Valid DisciplineDto dto) {
        return service.update(id, dto);
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id, @QueryParam("replaceWith") Long replaceWith) {
        service.delete(id, replaceWith);
        return Response.noContent().build();
    }
}
