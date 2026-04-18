# Könyvtár App

Online library web application — search, browse, and borrow books.

## Quick Start

```bash
cp .env.example .env
docker compose up -d
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:4000/api/v1 |
| Keycloak | http://localhost:8080 |
| Grafana | http://localhost:3001 |

Default Grafana credentials: `admin / changeme`

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| Backend | Express.js + TypeScript |
| Database | PostgreSQL 16 + TypeORM |
| Auth | Keycloak 24 (JWT / PKCE) |
| Cache | Redis 7 |
| Observability | OpenTelemetry → Grafana + Tempo + Prometheus |
| CI/CD | GitHub Actions |

## Documentation

- [Architecture](docs/architecture.md)
- [API Reference](docs/api.md)
- [Deployment](docs/deployment.md)
- [Keycloak Setup](docs/keycloak-setup.md)
- [ADR](docs/ADR.md)
- [PRD](docs/PRD.md)

## Running Tests

```bash
cd backend
npm test
```

Requires a running PostgreSQL instance at `TEST_DATABASE_URL` (default: `postgresql://konyvtar:changeme@localhost:5432/konyvtar_test`).
