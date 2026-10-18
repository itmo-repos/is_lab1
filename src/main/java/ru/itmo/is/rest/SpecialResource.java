package ru.itmo.is.rest;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import java.util.List;
import ru.itmo.is.dto.AverageDto;
import ru.itmo.is.dto.GroupCountDto;
import ru.itmo.is.dto.LabWorkDto;
import ru.itmo.is.service.SpecialService;

@Path("/special")
@Produces(MediaType.APPLICATION_JSON)
@RequestScoped
public class SpecialResource {

    @Inject
    SpecialService service;

    @GET
    @Path("/average-minimal-point")
    public AverageDto averageMinimalPoint() {
        return service.averageMinimalPoint();
    }

    @GET
    @Path("/group-by-id")
    public List<GroupCountDto> groupById() {
        return service.groupById();
    }

    @GET
    @Path("/minimal-point-greater")
    public List<LabWorkDto> minimalPointGreater(@QueryParam("value") Float value) {
        return service.minimalPointGreater(value);
    }

    @POST
    @Path("/labworks/{id}/decrease-difficulty")
    public LabWorkDto decreaseDifficulty(@PathParam("id") Integer id,
                                         @QueryParam("steps") Integer steps) {
        return service.decreaseDifficulty(id, steps);
    }

    @POST
    @Path("/disciplines/{disciplineId}/labworks/{labWorkId}/remove")
    public LabWorkDto removeFromDiscipline(@PathParam("disciplineId") Long disciplineId,
                                           @PathParam("labWorkId") Integer labWorkId) {
        return service.removeFromDiscipline(disciplineId, labWorkId);
    }
}
