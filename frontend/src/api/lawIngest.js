import { apiRequest, LONG_REQUEST_MS } from './client';

export function runLawIngest() {
  return apiRequest('/law-ingest/run', {
    method: 'POST',
    timeoutMs: LONG_REQUEST_MS,
  });
}
