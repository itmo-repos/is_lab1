package ru.itmo.is.rest;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.sse.Sse;
import jakarta.ws.rs.sse.SseEventSink;
import ru.itmo.is.event.ChangeNotifier;

@Path("/events")
@RequestScoped
public class EventsResource {

    @Inject
    ChangeNotifier notifier;

    @GET
    @Produces(MediaType.SERVER_SENT_EVENTS)
    public void subscribe(@Context Sse sse, @Context SseEventSink sink) {
        notifier.subscribe(sse, sink);
    }
}
