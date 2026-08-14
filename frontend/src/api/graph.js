import { apiRequest } from './client';

export function getGraph() {
  return apiRequest('/graph');
}
