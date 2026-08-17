import { apiRequest, LONG_REQUEST_MS } from './client';

export function draftRemediation({ signal } = {}) {
  return apiRequest('/remediation/draft', {
    method: 'POST',
    timeoutMs: LONG_REQUEST_MS,
    signal,
  });
}

export function getSuggestions() {
  return apiRequest('/remediation/suggestions');
}

export function updateSuggestion(id, payload) {
  return apiRequest(`/remediation/suggestions/${id}`, {
    method: 'PATCH',
    body: payload,
  });
}

export function getFinalDraft() {
  return apiRequest('/remediation/final-draft');
}

export function updateFinalDraft(text) {
  return apiRequest('/remediation/final-draft', {
    method: 'PATCH',
    body: { text },
  });
}

export function finalizeDraft() {
  return apiRequest('/remediation/finalize', {
    method: 'POST',
    timeoutMs: LONG_REQUEST_MS,
  });
}

export function getRemediationHistory(limit = 20) {
  return apiRequest(`/remediation/history?limit=${limit}`);
}

export function getRemediationDiff(fromRev, toRev = 'HEAD') {
  const params = new URLSearchParams({ from_rev: fromRev, to_rev: toRev });
  return apiRequest(`/remediation/diff?${params.toString()}`);
}
