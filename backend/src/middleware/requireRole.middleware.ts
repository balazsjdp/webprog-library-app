import { Request, Response, NextFunction } from 'express';

export const requireRole =
  (role: string) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user?.realm_access?.roles.includes(role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }
    next();
  };
