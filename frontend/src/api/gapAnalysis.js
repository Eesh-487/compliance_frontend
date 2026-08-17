import { apiRequest, LONG_REQUEST_MS } from './client';

export function runGapAnalysis({ signal } = {}) {
  return apiRequest('/gap-analysis/run', {
    method: 'POST',
    timeoutMs: LONG_REQUEST_MS,
    signal,
  });
}
