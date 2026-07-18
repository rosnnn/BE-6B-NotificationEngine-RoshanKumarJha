# Architecture

## C4 Summary
- Context: market systems and risk systems publish financial events.
- Container: API service, stream bus (Kafka), queue (RabbitMQ), state stores (PostgreSQL, Redis), and provider adapters.
- Component: ingestion validator, routing engine, compliance layer, template renderer, provider dispatch, analytics pipeline.

## Core Flow
1. Client posts event to /api/v1/events.
2. Zod validates payload and event metadata.
3. Preference engine resolves user channel settings.
4. Compliance engine applies DND, quiet hours, and frequency caps.
5. Router selects channels with priority and regulatory override logic.
6. Delivery state is persisted and analytics counters are updated.

## Reliability Patterns
- Idempotency key support through event_id.
- Priority-aware handling for critical notifications.
- Retry policy model with exponential backoff and jitter.
- Structured logging and health endpoints.
