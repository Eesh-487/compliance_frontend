import { apiRequest, LONG_REQUEST_MS } from './client';

export function runGraphBuilder({ signal } = {}) {
  return apiRequest('/graph-builder/run', {
    method: 'POST',
    timeoutMs: LONG_REQUEST_MS,
    signal,
  });
}
