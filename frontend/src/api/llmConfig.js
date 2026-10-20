import { apiRequest } from './client';

export function getLlmConfig() {
  return apiRequest('/llm/config');
}

// Send an empty `model` to switch the backend back to its local MLX model.
export function updateLlmConfig(config) {
  return apiRequest('/llm/config', { method: 'PUT', body: config });
}
