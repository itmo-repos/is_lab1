package ru.itmo.is.rest;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import ru.itmo.is.dto.LabWorkDetailsDto;
import ru.itmo.is.dto.LabWorkDto;
import ru.itmo.is.dto.PageDto;
import ru.itmo.is.service.LabWorkService;

@Path("/labworks")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RequestScoped
public class LabWorkResource {

    private static final Set<String> RESERVED_PARAMS = Set.of("page", "size", "sort", "order");

    @Inject
    LabWorkService service;

    @POST
    public Response create(@Valid LabWorkDto dto) {
        return Response.status(Response.Status.CREATED).entity(service.create(dto)).build();
    }

    @GET
    public PageDto<LabWorkDetailsDto> list(
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("10") int size,
            @QueryParam("sort") @DefaultValue("id") String sort,
            @QueryParam("order") @DefaultValue("asc") String order,
            @Context UriInfo uriInfo) {
        Map<String, String> filters = new LinkedHashMap<>();
        uriInfo.getQueryParameters().forEach((key, values) -> {
            String value = values.get(0);
            if (!RESERVED_PARAMS.contains(key) && !value.isBlank()) {
                filters.put(key, value);
            }
        });
        return service.list(page, size, sort, order, filters);
    }

    @GET
    @Path("/{id}")
    public LabWorkDetailsDto get(@PathParam("id") Integer id) {
        return service.get(id);
    }

    @PUT
    @Path("/{id}")
    public LabWorkDto update(@PathParam("id") Integer id, @Valid LabWorkDto dto) {
        return service.update(id, dto);
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Integer id) {
        service.delete(id);
        return Response.noContent().build();
    }
}
