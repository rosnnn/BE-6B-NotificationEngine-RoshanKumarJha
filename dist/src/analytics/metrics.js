import { Counter, Histogram, Registry, collectDefaultMetrics } from "prom-client";
export const metricsRegistry = new Registry();
collectDefaultMetrics({ register: metricsRegistry });
export const eventsReceived = new Counter({
    name: "notification_events_received_total",
    help: "Total events received",
    labelNames: ["event_type", "priority"],
    registers: [metricsRegistry],
});
export const deliveryLatency = new Histogram({
    name: "notification_delivery_latency_seconds",
    help: "Delivery latency in seconds",
    labelNames: ["channel", "priority"],
    buckets: [0.1, 0.5, 1, 2, 5, 10],
    registers: [metricsRegistry],
});
