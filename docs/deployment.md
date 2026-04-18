# Deployment

## Prerequisites

- Docker 24+ and Docker Compose v2
- Ports available: 3000, 4000, 8080, 3001, 9090

## Steps

1. **Clone the repository**

2. **Create the environment file**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` to set strong passwords before any production use.

3. **Start all services**

   ```bash
   docker compose up -d
   ```

   Startup order: `postgres` (health) → `keycloak` → `backend` → `frontend`, independently `otel-collector` → `tempo` + `prometheus` → `grafana`.

4. **Verify**

   ```bash
   docker compose ps
   curl http://localhost:4000/api/v1/health/ready
   ```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `POSTGRES_USER` | `konyvtar` | PostgreSQL user |
| `POSTGRES_PASSWORD` | `changeme` | PostgreSQL password |
| `POSTGRES_DB` | `konyvtar` | PostgreSQL database |
| `KEYCLOAK_ADMIN` | `admin` | Keycloak admin username |
| `KEYCLOAK_ADMIN_PASSWORD` | `changeme` | Keycloak admin password |
| `GF_SECURITY_ADMIN_PASSWORD` | `changeme` | Grafana admin password |
| `TEST_DATABASE_URL` | `postgresql://...konyvtar_test` | Test database URL |

## Development Overrides

`docker-compose.override.yml` exposes extra ports for local development:
- PostgreSQL: `5432`
- Redis: `6379`
- Backend: `4000`

## Stopping

```bash
docker compose down          # keep volumes
docker compose down -v       # destroy volumes (data loss!)
```
