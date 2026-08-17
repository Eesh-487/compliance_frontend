import { apiRequest, LONG_REQUEST_MS } from './client';

export function runLawIngest({ signal } = {}) {
  return apiRequest('/law-ingest/run', {
    method: 'POST',
    timeoutMs: LONG_REQUEST_MS,
    signal,
  });
}
