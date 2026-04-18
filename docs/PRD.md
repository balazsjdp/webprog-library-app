# PRD — Product Requirements Document

> **Projekt:** Könyvtár App  
> **Dátum:** 2026-04-18  
> **Státusz:** Jóváhagyott

---

## 1. Termék összefoglaló

Online könyvtár webalkalmazás, amelyben a felhasználók könyveket kereshetnek, részleteiket megtekinthetik és kölcsönözhetik. Az admin szerepkörű felhasználók könyveket adhatnak hozzá (manuálisan vagy Open Library importálással), szerkeszthetnek és törölhetnek.

---

## 2. Felhasználói szerepek

| Szerepkör | Hozzáférés |
|---|---|
| Vendég (nem bejelentkezett) | Könyvek listázása, keresés, részletek megtekintése |
| `user` (bejelentkezett) | + Kölcsönzés, visszahozás, saját kölcsönzési előzmény |
| `admin` | + Könyv hozzáadás/szerkesztés/törlés, Open Library import, összes kölcsönzés megtekintése |

---

## 3. Funkcionális követelmények

### 3.1 Könyvek

- **F01** — Könyvek listázása lapozással (20/oldal), keresés cím/szerző alapján, szűrés genre szerint, elérhető példányok szűrője
- **F02** — Könyv részletek oldal: borítókép (Open Library URL vagy placeholder), leírás, elérhetőség jelzés
- **F03** — Admin: könyv manuális létrehozása (cím, szerző, ISBN, genre, példányszám, leírás)
- **F04** — Admin: könyv szerkesztése, soft delete (`isActive = false`)
- **F05** — Admin: Open Library keresés és importálás (cím/szerző keresés → eredmény lista → importálás)
- **F06** — Admin: példányszám módosítása

### 3.2 Kölcsönzés

- **F07** — Könyv kölcsönzése (bejelentkezett user): csökkenti az `availableCopies`-t, létrehoz `Borrowing` rekordot, `dueDate` = kölcsönzés napja + 30 nap
- **F08** — Könyv visszahozása: növeli az `availableCopies`-t, `status` = `returned`, `returnedAt` = aktuális időpont
- **F09** — Conflict kezelés: 0 elérhető példány → `409 Conflict`; ugyanaz a user már kölcsönözte → `409 Conflict`
- **F10** — Saját kölcsönzési előzmény oldal: státusz szerinti szűrés (aktív / visszahozott / lejárt)
- **F11** — Admin: összes kölcsönzés listája lapozással

### 3.3 Értesítések

- **F12** — Lejárt kölcsönzések: az app `overdue` státuszt jelenít meg (e-mail értesítés nincs)

---

## 4. Nem-funkcionális követelmények

| ID | Követelmény |
|---|---|
| NF01 | Reszponzív UI (Tailwind CSS breakpoint-ok, mobile-first) |
| NF02 | Legalább 2 API végpont |
| NF03 | PostgreSQL relációs adatbázis |
| NF04 | Legalább 2 unit vagy integrációs teszt |
| NF05 | Git verziókezelő, minimum 5 jól strukturált commit |
| NF06 | Markdown dokumentáció (README + docs/) |
| NF07 | Docker containerizáció (`docker compose up -d`) |
| NF08 | Keycloak JWT autentikáció |
| NF09 | TypeORM ORM rendszer |
| NF10 | Redis caching |
| NF11 | OpenTelemetry + Grafana + Tempo + Prometheus |
| NF12 | GitHub Actions CI/CD pipeline |

---

## 5. Technikai stack

| Réteg | Technológia |
|---|---|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| Server state | TanStack Query v5 |
| Client state | Zustand (auth) |
| Routing | React Router v6 |
| Backend | Express.js + TypeScript |
| ORM | TypeORM |
| Adatbázis | PostgreSQL 16 |
| Autentikáció | Keycloak 24 + keycloak-js + jose (JWT validáció) |
| Cache | Redis 7 + ioredis |
| Observability | OTel Node.js SDK + Collector + Tempo + Prometheus + Grafana |
| Containerizáció | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Book API | Open Library API |
| Testing | Jest + Supertest + ioredis-mock |

---

## 6. Projekt könyvtárstruktúra

```
konyvtar-app/
├── docker-compose.yml
├── docker-compose.override.yml       # dev: hot reload, debug portok
├── .env.example
├── .gitignore
├── README.md
├── .github/
│   └── workflows/
│       └── ci.yml
├── docs/
│   ├── ADR.md
│   ├── PRD.md
│   ├── api.md
│   ├── deployment.md
│   └── keycloak-setup.md
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.ts
│   └── src/
│       ├── main.ts                   # ELSŐ import: config/otel.ts
│       ├── app.ts                    # Express app factory (tesztekhez)
│       ├── config/
│       │   ├── otel.ts               # OTel SDK init — MUST be first
│       │   ├── database.ts           # TypeORM DataSource
│       │   ├── redis.ts              # ioredis client
│       │   └── keycloak.ts           # JWKS URL, realm config
│       ├── entities/
│       │   ├── Book.ts
│       │   └── Borrowing.ts
│       ├── migrations/
│       │   └── 001_initial_schema.ts
│       ├── services/
│       │   ├── BookService.ts
│       │   ├── BorrowingService.ts
│       │   ├── CacheService.ts
│       │   └── OpenLibraryService.ts
│       ├── controllers/
│       │   ├── BookController.ts
│       │   ├── BorrowingController.ts
│       │   ├── AdminController.ts
│       │   └── HealthController.ts
│       ├── routes/
│       │   ├── index.ts
│       │   ├── books.routes.ts
│       │   ├── borrowings.routes.ts
│       │   └── admin.routes.ts
│       ├── middleware/
│       │   ├── auth.middleware.ts
│       │   ├── requireRole.middleware.ts
│       │   ├── cache.middleware.ts
│       │   └── errorHandler.middleware.ts
│       └── __tests__/
│           ├── setup.ts
│           ├── books.integration.test.ts
│           ├── borrowings.integration.test.ts
│           └── openLibrary.unit.test.ts
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── keycloak.ts
│       ├── api/
│       │   ├── client.ts
│       │   ├── books.api.ts
│       │   ├── borrowings.api.ts
│       │   └── admin.api.ts
│       ├── hooks/
│       │   ├── useBooks.ts
│       │   ├── useBorrowings.ts
│       │   └── useAuth.ts
│       ├── pages/
│       │   ├── HomePage.tsx
│       │   ├── BookDetailPage.tsx
│       │   ├── MyBorrowingsPage.tsx
│       │   ├── AdminPage.tsx
│       │   └── NotFoundPage.tsx
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Header.tsx
│       │   │   └── Layout.tsx
│       │   ├── books/
│       │   │   ├── BookCard.tsx
│       │   │   ├── BookGrid.tsx
│       │   │   ├── BookSearchBar.tsx
│       │   │   └── BookCoverImage.tsx
│       │   ├── borrowings/
│       │   │   ├── BorrowButton.tsx
│       │   │   └── BorrowingHistoryTable.tsx
│       │   ├── admin/
│       │   │   ├── BookFormModal.tsx
│       │   │   ├── OpenLibraryImportModal.tsx
│       │   │   └── AdminBookTable.tsx
│       │   └── common/
│       │       ├── Pagination.tsx
│       │       ├── LoadingSpinner.tsx
│       │       └── ProtectedRoute.tsx
│       └── store/
│           └── authStore.ts
├── observability/
│   ├── otel-collector-config.yml
│   ├── prometheus.yml
│   ├── tempo.yml
│   └── grafana/
│       ├── provisioning/
│       │   └── datasources/datasources.yml
│       └── dashboards/
│           ├── api-overview.json
│           └── borrowing-stats.json
└── keycloak/
    └── realm-export.json
```

---

## 7. Adatbázis séma

### Book entitás

```
books
├── id              UUID PK
├── title           VARCHAR(500) NOT NULL
├── author          VARCHAR(300) NOT NULL
├── isbn            VARCHAR(13) UNIQUE NULLABLE
├── description     TEXT NULLABLE
├── publisher       VARCHAR(100) NULLABLE
├── publishedYear   INT NULLABLE
├── genre           VARCHAR(100) NULLABLE
├── totalCopies     INT DEFAULT 1
├── availableCopies INT DEFAULT 1
├── coverImageUrl   VARCHAR(500) NULLABLE
├── isActive        BOOLEAN DEFAULT true     -- soft delete
├── createdAt       TIMESTAMP
└── updatedAt       TIMESTAMP

Index: (title, author)
```

### Borrowing entitás

```
borrowings
├── id          UUID PK
├── userId      UUID NOT NULL               -- Keycloak sub claim
├── userName    VARCHAR(300) NOT NULL       -- denormalizált megjelenítéshez
├── bookId      UUID FK → books.id
├── status      ENUM(active, returned, overdue) DEFAULT active
├── borrowedAt  TIMESTAMP (auto)
├── dueDate     TIMESTAMP                   -- borrowedAt + 30 nap
└── returnedAt  TIMESTAMP NULLABLE

Index: (userId), (status), (dueDate)
```

> Nincs `users` tábla — a user identity Keycloak-ban él.

---

## 8. API végpontok

### Base URL: `/api/v1`

#### Nyilvános (autentikáció nélkül)

| Method | Path | Cache TTL | Leírás |
|---|---|---|---|
| `GET` | `/books` | 120s | Könyvek listája lapozással és szűréssel |
| `GET` | `/books/:id` | 300s | Könyv részletek |
| `GET` | `/health` | — | Liveness probe |
| `GET` | `/health/ready` | — | Readiness (DB + Redis ellenőrzés) |

**GET /books query paraméterek:**
```
?page=1&limit=20&search=tolkien&genre=Fantasy&available=true
```

**GET /books response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "A Gyűrűk Ura",
      "author": "J.R.R. Tolkien",
      "isbn": "9789634052043",
      "genre": "Fantasy",
      "availableCopies": 2,
      "totalCopies": 3,
      "coverImageUrl": "https://covers.openlibrary.org/b/isbn/9789634052043-M.jpg",
      "publishedYear": 1954
    }
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

#### Hitelesített (user + admin szerepkör)

| Method | Path | Leírás |
|---|---|---|
| `POST` | `/borrowings` | Könyv kölcsönzése |
| `POST` | `/borrowings/:id/return` | Könyv visszahozása |
| `GET` | `/borrowings/my` | Saját kölcsönzési előzmény |

**POST /borrowings request:**
```json
{ "bookId": "uuid" }
```

**POST /borrowings response (201):**
```json
{
  "id": "uuid",
  "bookId": "uuid",
  "bookTitle": "A Gyűrűk Ura",
  "borrowedAt": "2026-04-18T09:00:00Z",
  "dueDate": "2026-05-18T09:00:00Z",
  "status": "active"
}
```

**Hibaesetek:**
- `401 Unauthorized` — nincs vagy érvénytelen token
- `404 Not Found` — könyv nem létezik
- `409 Conflict` — nincs elérhető példány, vagy a user már kölcsönözte

#### Admin only

| Method | Path | Leírás |
|---|---|---|
| `POST` | `/admin/books` | Könyv manuális létrehozása |
| `PUT` | `/admin/books/:id` | Könyv szerkesztése |
| `DELETE` | `/admin/books/:id` | Könyv soft delete |
| `GET` | `/admin/books/search-ol` | Open Library keresés (`?q=...`) |
| `POST` | `/admin/books/import` | Open Library importálás |
| `PATCH` | `/admin/books/:id/copies` | Példányszám módosítása |
| `GET` | `/admin/borrowings` | Összes kölcsönzés listája |

---

## 9. Frontend oldalak

| Útvonal | Oldal | Auth szükséges |
|---|---|---|
| `/` | HomePage — keresés + könyvgrid + lapozás | Vendég |
| `/books/:id` | BookDetailPage — részletek + kölcsönzés gomb | Vendég |
| `/my-borrowings` | MyBorrowingsPage — saját előzmény | `user` |
| `/admin` | AdminPage — könyvkezelés + kölcsönzések | `admin` |
| `/*` | NotFoundPage | — |

---

## 10. Tesztek

### Integrációs tesztek — `supertest` + valós test DB

**books.integration.test.ts:**
- `GET /books` — lapozott lista visszaadása
- `GET /books` — keresési szűrés cím alapján
- `GET /books/:id` — létező könyv visszaadása
- `GET /books/:id` — `404` ismeretlen id-re

**borrowings.integration.test.ts:**
- `POST /borrowings` — kölcsönzés csökkenti az `availableCopies`-t
- `POST /borrowings` — `401` token nélkül
- `POST /borrowings` — `409` ha 0 elérhető példány
- `POST /borrowings/:id/return` — visszahozás növeli az `availableCopies`-t
- `GET /borrowings/my` — csak a bejelentkezett user kölcsönzéseit adja vissza

### Unit tesztek

**openLibrary.unit.test.ts:**
- OL search response → belső DTO mapping
- Helyes cover URL generálás ISBN-ből
- Hiányzó ISBN esetén graceful fallback

**Teszt környezet:**
- Külön `konyvtar_test` PostgreSQL DB (`synchronize: true`)
- `ioredis-mock` Redis helyett
- JWT-t közvetlenül generálunk teszt private key-jel (nincs Keycloak dependency tesztekben)

---

## 11. Docker Compose szolgáltatások

| Szolgáltatás | Image | Port(ok) | Cél |
|---|---|---|---|
| `postgres` | `postgres:16-alpine` | 5432 | Fő DB + Keycloak DB |
| `redis` | `redis:7-alpine` | 6379 | Cache réteg |
| `keycloak` | `keycloak:24.0` | 8080 | Identity provider |
| `backend` | `./backend` | 4000 | REST API szerver |
| `frontend` | `./frontend` | 3000 | React SPA (nginx) |
| `otel-collector` | `otel/opentelemetry-collector-contrib` | 4317, 4318 | Telemetria gyűjtő |
| `tempo` | `grafana/tempo` | 3200 | Trace storage |
| `prometheus` | `prom/prometheus` | 9090 | Metrics storage |
| `grafana` | `grafana/grafana` | 3001 | Dashboards UI |

**Startup sorrend:** `postgres` (healthcheck) → `keycloak` → `backend` → `frontend`; párhuzamosan: `otel-collector` → `tempo` + `prometheus` → `grafana`.

---

## 12. GitHub Actions CI pipeline

```yaml
# .github/workflows/ci.yml
on: [push, pull_request]

jobs:
  ci:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_DB: konyvtar_test
          POSTGRES_USER: konyvtar
          POSTGRES_PASSWORD: test
    steps:
      - lint        # ESLint + Prettier check
      - typecheck   # tsc --noEmit (backend + frontend)
      - test        # jest --runInBand
      - build       # docker build backend + frontend
```

---

## 13. Implementációs sorrend (Git commit terv)

| # | Commit üzenet | Tartalom |
|---|---|---|
| 1 | `chore: project scaffolding` | Monorepo struktúra, Docker Compose, Dockerfile-ok, `.env.example`, `.gitignore` |
| 2 | `feat: backend core` | TypeORM entityk, migráció, Express app factory, health endpoint, OTel init |
| 3 | `feat: books API + caching` | Book CRUD endpoints, Redis cache middleware, OpenLibrary service |
| 4 | `feat: borrowing system + auth` | Borrowing API, Keycloak JWT middleware, admin endpoints |
| 5 | `feat: frontend scaffold` | Vite setup, routing, Keycloak-js init, Axios client, Tailwind CSS |
| 6 | `feat: frontend pages` | HomePage, BookDetailPage, MyBorrowingsPage |
| 7 | `feat: admin panel` | AdminPage, BookFormModal, OpenLibraryImportModal |
| 8 | `feat: observability` | Grafana dashboards JSON, Prometheus + Tempo config, OTel Collector config |
| 9 | `test: integration and unit tests` | books + borrowings integráció, OL unit tesztek, teszt setup |
| 10 | `ci: github actions pipeline` | CI workflow, lint/typecheck/test/build lépések |
| 11 | `docs: project documentation` | README, api.md, architecture.md, deployment.md, keycloak-setup.md |

---

## 14. Verifikációs terv

1. `docker compose up -d` — minden service `healthy` állapotba kerül
2. **Grafana** `http://localhost:3001` — dashboards betöltődnek, Prometheus + Tempo datasource-ok zöldek
3. **Keycloak** `http://localhost:8080` — `konyvtar` realm importálva, `user` + `admin` szerepkörök léteznek
4. **Frontend** `http://localhost:3000` — könyvlista megjelenik vendégként
5. Bejelentkezés (Keycloak) → könyv kölcsönzése → saját előzmény oldalon megjelenik az aktív kölcsönzés
6. Admin bejelentkezés → könyv hozzáadása manuálisan → Open Library importálás
7. `npm test` a `backend/` mappában — minden teszt zöld
8. GitHub Actions push → CI pipeline zöld

---

## 15. Dokumentáció tartalma

| Fájl | Tartalom |
|---|---|
| `README.md` | Rövid leírás, gyors indítás (`docker compose up`), screenshot-ok |
| `docs/ADR.md` | Architekturális döntések és indoklásuk |
| `docs/PRD.md` | Ez a dokumentum |
| `docs/api.md` | Összes végpont részletes leírása, request/response példákkal |
| `docs/deployment.md` | Docker Compose indítás, környezeti változók leírása |
| `docs/keycloak-setup.md` | Realm konfiguráció, user/admin létrehozás lépései |
