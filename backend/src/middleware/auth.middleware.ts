import { Request, Response, NextFunction } from 'express';
import { jwtVerify, createRemoteJWKSet } from 'jose';
import { KEYCLOAK_JWKS_URL, KEYCLOAK_REALM_URL } from '../config/keycloak';

// JWKS set caches keys internally (10-minute TTL by default)
const JWKS = createRemoteJWKSet(new URL(KEYCLOAK_JWKS_URL));

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid authorization header' });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: KEYCLOAK_REALM_URL,
    });

    req.user = {
      sub: String(payload.sub ?? ''),
      preferred_username: String(payload['preferred_username'] ?? ''),
      email: payload['email'] ? String(payload['email']) : undefined,
      realm_access: payload['realm_access'] as { roles: string[] } | undefined,
    };

    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
