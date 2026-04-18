import { metrics } from '@opentelemetry/api';

const meter = metrics.getMeter('konyvtar-backend');

export const cacheHits = meter.createCounter('cache.hits', {
  description: 'Number of cache hits',
});

export const cacheMisses = meter.createCounter('cache.misses', {
  description: 'Number of cache misses',
});

export const borrowingsCreated = meter.createCounter('borrowings.created', {
  description: 'Total borrowings created',
});

// UpDownCounter: incremented on borrow, decremented on return
export const borrowingsActive = meter.createUpDownCounter('borrowings.active', {
  description: 'Currently active borrowings',
});
