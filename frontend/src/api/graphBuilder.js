import { apiRequest } from './client';

// Kicks off a background job and returns { job_id } almost immediately -
// see api/jobs.js for the poll-until-done pattern that consumes it.
export function runGraphBuilder() {
  return apiRequest('/graph-builder/run', { method: 'POST' });
}
