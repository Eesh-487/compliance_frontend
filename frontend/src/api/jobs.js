import { apiRequest } from './client';

const POLL_INTERVAL_MS = 2000;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getJobStatus(jobId) {
  return apiRequest(`/jobs/${jobId}`);
}

export function cancelJob(jobId) {
  return apiRequest(`/jobs/${jobId}/cancel`, { method: 'POST' });
}

// Every long-running pipeline stage starts as a background job instead of
// blocking one HTTP request until it finishes (see the backend's jobs.py) -
// no single request has to survive a multi-minute, multi-LLM-call run,
// which was failing over any path with its own idle-connection timeout
// (Tailscale Funnel, mobile NAT, a proxy). `startFn` kicks the job off and
// must resolve to `{ job_id }`; this polls status until it's done, failed,
// or cancelled.
export async function runJobToCompletion(startFn, { onJobId } = {}) {
  const { job_id: jobId } = await startFn();
  onJobId?.(jobId);

  for (;;) {
    await wait(POLL_INTERVAL_MS);
    const status = await getJobStatus(jobId);

    if (status.status === 'done') {
      return status.result;
    }
    if (status.status === 'cancelled') {
      throw { message: 'Stopped.', status: 499, aborted: true };
    }
    if (status.status === 'failed') {
      throw { message: status.error || 'Job failed.', status: 500 };
    }
    // 'running' or 'cancelling' - keep polling.
  }
}
