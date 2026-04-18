# Architecture

## Overview

```
Browser
  │
  ▼
Frontend (React/Vite, nginx:3000)
  │  REST / JSON
  ▼
Backend API (Express.js:4000)
  │          │             │
  ▼          ▼             ▼
PostgreSQL  Redis        Keycloak
(TypeORM)  (Cache)      (JWT auth)
  │
  ▼
OpenLibrary API (external, book data + covers)

Observability:
Backend ──OTLP──► OTel Collector ──► Tempo (traces)
                                └──► Prometheus (metrics)
                                        ▼
                                     Grafana
```

## Services

| Service | Role |
|---|---|
| `frontend` | React SPA served by nginx. Authenticates via Keycloak PKCE flow. |
| `backend` | REST API. Validates JWT offline (JWKS), caches responses in Redis. |
| `postgres` | Primary database. Also hosts Keycloak's DB (`keycloak` schema). |
| `redis` | Cache-aside strategy. TTLs: book list 120s, detail 300s, borrowings 60s. |
| `keycloak` | Identity provider. Realm `konyvtar`, roles: `user` (default), `admin`. |
| `otel-collector` | Receives OTLP traces + metrics, exports to Tempo and Prometheus. |
| `tempo` | Distributed trace storage (Grafana Tempo). |
| `prometheus` | Metrics storage, scraped from OTel Collector on port 8889. |
| `grafana` | Dashboards: `api-overview` (latency, errors, cache hit rate), `borrowing-stats`. |

## Key Decisions

See [ADR.md](ADR.md) for full decision records.

- **Auth**: Keycloak JWT validated via JWKS — no session storage in the app.
- **No users table**: User identity lives in Keycloak; only `userId` (sub claim) is stored in `borrowings`.
- **Soft delete**: Books are never physically deleted — `isActive = false`.
- **Pessimistic locking**: Borrow transactions use `SELECT ... FOR UPDATE` to prevent race conditions.
- **Redis SCAN**: Cache invalidation uses `SCAN` pattern (not `KEYS`) to avoid blocking.
