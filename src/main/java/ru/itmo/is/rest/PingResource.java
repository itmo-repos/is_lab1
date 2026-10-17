package ru.itmo.is.rest;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import ru.itmo.is.service.PingService;

import java.util.Map;

@Path("/ping")
@Produces(MediaType.APPLICATION_JSON)
@RequestScoped
public class PingResource {

    @Inject
    private PingService service;

    @GET
    public Map<String, String> ping() {
        return Map.of("status", "ok");
    }

    @GET
    @Path("/db")
    public Map<String, Object> db() {
        return Map.of("status", "ok", "select1", service.selectOne());
    }
}
