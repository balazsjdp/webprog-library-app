# ADR — Architecture Decision Records

> **Projekt:** Könyvtár App  
> **Dátum:** 2026-04-18

---

## ADR-001: Book API — Open Library

**Döntés:** Open Library API használata könyvadatokhoz és borítóképekhez.

**Indok:**
- Teljesen ingyenes, nincs API kulcs szükséges
- Borítóképek közvetlen HTTP URL-en érhetők el: `https://covers.openlibrary.org/b/isbn/{ISBN}-{S|M|L}.jpg`
- Keresés cím, szerző, ISBN alapján
- Rate limit: 3 req/s (User-Agent headerrel), covers: 100 req/5 perc
- Megbízható: Internet Archive üzemelteti
- Egyszerű REST JSON API, jól dokumentált

**Elutasított alternatívák:**
- Google Books API: ingyenes, de API kulcs kell, Google Cloud Console setup szükséges
- ISBNdb: fizetős ($14.99/hó), nem megfelelő
- WorldCat: nem ad borítóképeket

**Következmény:** A borítókép URL-eket közvetlenül az Open Library-ból töltjük (nem proxyzunk), és az adatbázisban csak az URL-t tároljuk. Fallback: helyi SVG placeholder.

---

## ADR-002: Authentication — Keycloak (JWT)

**Döntés:** Keycloak self-hosted (Docker) + Keycloak-js frontend adapter + backend JWKS JWT validáció.

**Indok:**
- Realm-export.json-nal automatikusan importálható konfiguráció (`docker compose up` után azonnal kész)
- Realm szerepek: `user` (alapértelmezett új regisztrációkor), `admin` (manuálisan kiosztott)
- A backend offline validálja a JWT-t (JWKS endpoint) — nincs keycloak dependency minden kérésnél
- PKCE flow SPA-hoz (biztonságos, nincs client secret a frontenden)

**Nem tárolunk `users` táblát:** A user identity a Keycloak-ban él. A `borrowings` táblában `userId` = Keycloak `sub` claim (UUID), `userName` = denormalizált a megjelenítéshez.

---

## ADR-003: ORM — TypeORM

**Döntés:** TypeORM PostgreSQL-hez.

**Indok:** TypeScript-natív, decorator-alapú, jól integrálódik Express-szel. Migration rendszert használunk production-ban (nem `synchronize: true`). A teszt DB-n `synchronize: true` az egyszerűség kedvéért.

**Entityk:** `Book`, `Borrowing` — részletek a PRD DB szekcióban.

---

## ADR-004: Caching — Redis

**Döntés:** Redis cache-aside stratégiával, `ioredis` klienssel.

**Mit cache-elünk:**

| Cache kulcs | TTL | Invalidálás |
|---|---|---|
| `books:list:{hash(params)}` | 120s | Bármely book create/update/delete |
| `books:detail:{bookId}` | 300s | Adott book update/delete; kölcsönzés/visszahozás |
| `borrowings:my:{userId}:{status}:{page}` | 60s | User kölcsönöz / visszahoz |
| `ol:search:{hash(query)}` | 3600s | Soha (külső, ritkán változó adat) |

**Cache invalidáció:** Redis `SCAN` + `DEL` pattern alapján (nem `KEYS`, hogy ne blokkoljuk a Redis event loop-ját).

**Teszt környezetben:** `ioredis-mock` — nem kell futó Redis instance a tesztekhez.

---

## ADR-005: Observability — OpenTelemetry + Grafana Stack

**Döntés:** OTel Node.js SDK → OTEL Collector → Tempo (traces) + Prometheus (metrics) → Grafana.

**Auto-instrumentáció:**
- `@opentelemetry/instrumentation-express` — HTTP span per route
- `@opentelemetry/instrumentation-pg` — PostgreSQL query span
- `@opentelemetry/instrumentation-ioredis` — Redis parancs span
- `@opentelemetry/instrumentation-http` — kimenő HTTP (Open Library API hívások)

**Custom metrikák:** `cache.hits` és `cache.misses` counter, `cache.key_prefix` attribútummal.

**Kritikus:** Az OTel SDK init (`src/config/otel.ts`) az ELSŐ import kell legyen `main.ts`-ben — különben az auto-instrumentáció patch-elés előtt töltődnek be a modulok, és nem működik.

**Grafana dashboards (pre-provisioned JSON-ból):**
1. `api-overview` — request rate, P95 latency, error rate, cache hit arány
2. `borrowing-stats` — napi kölcsönzések, aktív kölcsönzések, top 10 legtöbbet kölcsönzött könyv

---

## ADR-006: CI/CD — GitHub Actions

**Döntés:** GitHub Actions pipeline PR-okon és `main` branch push-on.

**Pipeline lépések:**
1. `lint` — ESLint + Prettier check
2. `typecheck` — `tsc --noEmit` backend + frontend
3. `test` — Jest integrációs + unit tesztek (PostgreSQL service konténerben, ioredis-mock)
4. `build` — Docker image build (smoke test)

---

## ADR-007: Frontend — React + Vite + Tailwind CSS

**Döntés:** Vite build tool, Tailwind CSS utility-first styling, TanStack Query v5 server state-hez, Zustand client auth state-hez, React Router v6 routing-hoz.

**Magyar UI:** Minden felirat, hibaüzenet és gomb szövege magyar nyelvű.

**URL-alapú state:** A keresési paraméterek és lapozás URL search params-ban tárolódik (`?page=1&search=tolkien&genre=Fantasy`) — megosztható és böngésző back/forward kompatibilis.
