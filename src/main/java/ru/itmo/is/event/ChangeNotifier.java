package ru.itmo.is.event;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.enterprise.event.TransactionPhase;
import jakarta.ws.rs.sse.Sse;
import jakarta.ws.rs.sse.SseBroadcaster;
import jakarta.ws.rs.sse.SseEventSink;

@ApplicationScoped
public class ChangeNotifier {

    private Sse sse;
    private SseBroadcaster broadcaster;

    public synchronized void subscribe(Sse sse, SseEventSink sink) {
        if (broadcaster == null) {
            this.sse = sse;
            this.broadcaster = sse.newBroadcaster();
        }
        broadcaster.register(sink);
    }

    public synchronized void onChange(@Observes(during = TransactionPhase.AFTER_SUCCESS) ChangedEvent event) {
        if (broadcaster != null) {
            broadcaster.broadcast(sse.newEventBuilder().name("changed").data(event.entity()).build());
        }
    }
}
