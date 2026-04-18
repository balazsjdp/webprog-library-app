# Keycloak Setup

The `konyvtar` realm is automatically imported on first startup from `keycloak/realm-export.json`. No manual configuration is needed for `docker compose up`.

## Realm Configuration

- **Realm:** `konyvtar`
- **Client:** `konyvtar-frontend` (public, PKCE S256)
- **Valid redirect URIs:** `http://localhost:3000/*`
- **Web origins:** `http://localhost:3000`
- **Roles:** `user` (default for all new users), `admin`

## Creating Users

1. Open Keycloak Admin Console: http://localhost:8080
2. Log in with `admin / changeme` (or your configured password)
3. Select the `konyvtar` realm
4. Go to **Users → Add user**
5. Set username, email, and enable the account
6. Under **Credentials**, set a password (turn off "Temporary")

## Granting Admin Role

1. Open the user in Keycloak Admin
2. Go to **Role mapping → Assign role**
3. Filter by realm roles and select `admin`

## Token Details

- **Flow:** Authorization Code + PKCE (S256)
- **Access token lifespan:** 5 minutes (configurable in realm settings)
- **JWT claims used by backend:**
  - `sub` — user ID stored in borrowings
  - `preferred_username` — display name stored in borrowings
  - `realm_access.roles` — checked for `admin` role

## JWKS Endpoint

The backend validates tokens offline using the JWKS endpoint:

- External (for `iss` claim): `http://localhost:8080/realms/konyvtar`
- Internal Docker network: `http://keycloak:8080/realms/konyvtar`

These are configured via `KEYCLOAK_REALM_URL` and `KEYCLOAK_INTERNAL_URL` environment variables.
