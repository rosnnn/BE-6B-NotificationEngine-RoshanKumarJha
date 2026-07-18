# System Architecture

This document describes context, container, and component architecture for the event-driven notification engine.

## Context Diagram
- Upstream systems: trading engine, risk engine, compliance engine.
- Core platform: ingestion API, routing, compliance, delivery, analytics.
- Delivery channels: SMS, email, push, WhatsApp, in-app.

## Container Diagram
- API service handles ingress and preference endpoints.
- Kafka topic accepts event stream for async pipeline.
- RabbitMQ handles priority queueing and DLQ.
- PostgreSQL stores audit and notification records.
- Redis stores caps, cache, and dedupe state.

## Component Diagram
- Validation layer (Zod)
- Preference resolver
- Compliance checks (DND, quiet-hours, caps)
- Routing engine
- Template engine
- Delivery adapters
- Metrics and analytics
