declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: string;
        preferred_username: string;
        email?: string;
        realm_access?: { roles: string[] };
      };
    }
  }
}

export {};
