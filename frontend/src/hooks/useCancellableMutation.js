import { useCallback, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { cancelJob, runJobToCompletion } from '../api/jobs';

// Wraps useMutation around the start-job/poll-until-done pattern (see
// api/jobs.js) so long-running (LLM-backed) mutations can be stopped from
// the UI. `startFn` must kick off the job and resolve to `{ job_id }`;
// stopping calls the backend's cancel endpoint rather than just abandoning
// a fetch, so it actually halts the job server-side.
export function useCancellableMutation(startFn, options = {}) {
  const jobIdRef = useRef(null);

  const mutation = useMutation({
    ...options,
    mutationFn: () =>
      runJobToCompletion(startFn, {
        onJobId: (jobId) => {
          jobIdRef.current = jobId;
        },
      }),
  });

  const stop = useCallback(() => {
    if (jobIdRef.current) {
      cancelJob(jobIdRef.current).catch(() => {});
    }
  }, []);

  return { ...mutation, stop };
}
