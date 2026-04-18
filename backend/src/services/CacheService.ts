import { createHash } from 'crypto';
import { redis } from '../config/redis';
import { cacheHits, cacheMisses } from '../config/metrics';

export function hashParams(params: Record<string, unknown>): string {
  return createHash('md5').update(JSON.stringify(params)).digest('hex');
}

export const CacheService = {
  async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    const prefix = key.split(':')[0];
    if (data) {
      cacheHits.add(1, { prefix });
      return JSON.parse(data) as T;
    }
    cacheMisses.add(1, { prefix });
    return null;
  },

  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  },

  async del(key: string): Promise<void> {
    await redis.del(key);
  },

  async delPattern(pattern: string): Promise<void> {
    let cursor = '0';
    do {
      const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', '100');
      cursor = nextCursor;
      if (keys.length > 0) {
        await redis.del(keys);
      }
    } while (cursor !== '0');
  },
};
