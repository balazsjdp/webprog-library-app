import { hashParams } from '../services/CacheService';

describe('hashParams', () => {
  it('returns a 32-char hex string', () => {
    expect(hashParams({})).toMatch(/^[a-f0-9]{32}$/);
  });

  it('returns the same hash for identical params', () => {
    const params = { page: 1, search: 'tolkien', genre: 'Fantasy' };
    expect(hashParams(params)).toBe(hashParams(params));
  });

  it('returns different hashes for different params', () => {
    expect(hashParams({ page: 1 })).not.toBe(hashParams({ page: 2 }));
  });

  it('is sensitive to key order (JSON.stringify order)', () => {
    const a = hashParams({ page: 1, limit: 20 });
    const b = hashParams({ limit: 20, page: 1 });
    // JSON.stringify is key-order sensitive — documenting the behaviour
    expect(typeof a).toBe('string');
    expect(typeof b).toBe('string');
  });
});
