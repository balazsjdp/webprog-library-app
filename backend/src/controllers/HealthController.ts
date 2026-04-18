import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { redis } from '../config/redis';

export const HealthController = {
  liveness(_req: Request, res: Response): void {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  },

  async readiness(_req: Request, res: Response): Promise<void> {
    try {
      await AppDataSource.query('SELECT 1');
      await redis.ping();
      res.json({ status: 'ok', db: 'connected', redis: 'connected' });
    } catch (err) {
      res.status(503).json({ status: 'error', message: String(err) });
    }
  },
};
