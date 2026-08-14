import { apiRequest, LONG_REQUEST_MS } from './client';

export function runGraphBuilder() {
  return apiRequest('/graph-builder/run', {
    method: 'POST',
    timeoutMs: LONG_REQUEST_MS,
  });
}
