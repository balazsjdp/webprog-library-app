export const KEYCLOAK_REALM_URL =
  process.env.KEYCLOAK_REALM_URL ?? 'http://localhost:8080/realms/konyvtar';

export const KEYCLOAK_INTERNAL_URL =
  process.env.KEYCLOAK_INTERNAL_URL ?? 'http://keycloak:8080/realms/konyvtar';

export const KEYCLOAK_JWKS_URL =
  `${KEYCLOAK_INTERNAL_URL}/protocol/openid-connect/certs`;
