# Deployment Runbook

## Pre-Deployment Checklist
- Verify environment variables are set from .env.example.
- Validate Docker image build.
- Run npm run lint and npm test.
- Confirm /health and /metrics endpoints are reachable.

## Deployment Steps
1. Build image: docker build -t be-6b-notification-engine .
2. Start stack: docker compose up -d --build
3. Verify health: curl http://localhost:3000/health
4. Verify metrics: curl http://localhost:3000/metrics

## Rollback
1. docker compose down
2. Deploy previous image tag
3. Validate API health and sample event ingestion
