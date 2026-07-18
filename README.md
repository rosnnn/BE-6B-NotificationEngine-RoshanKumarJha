# BE-6B Event-Driven Notification Engine

A TypeScript backend for processing financial notification events with multi-channel routing, compliance checks, analytics, and test coverage.

## Highlights
- 25+ event taxonomy in docs/event-taxonomy.yaml
- Strict TypeScript and Zod validation for ingestion
- Priority-aware routing with regulatory override behavior
- DND and promotional opt-in compliance checks
- Frequency capping and quiet-hours behavior
- Prometheus metrics endpoint and analytics APIs
- Docker Compose stack for app + PostgreSQL + Redis + Kafka + RabbitMQ

## API Endpoints
- POST /api/v1/events
- GET /api/v1/users/:userId/preferences
- PUT /api/v1/users/:userId/preferences
- GET /api/v1/notifications/:notificationId
- GET /api/v1/analytics/delivery-rates
- GET /api/v1/analytics/channel-performance
- GET /api/v1/analytics/opt-out-trends
- GET /health
- GET /metrics

## Run Locally
1. npm install
2. npm run dev

## Run Tests
- npm test
- npm run test:coverage

## Docker
- docker compose up --build

## Docs
- docs/architecture.md
- docs/api-specification.yaml
- docs/event-taxonomy.yaml
- ARCHITECTURE.md
- DEPLOYMENT.md
