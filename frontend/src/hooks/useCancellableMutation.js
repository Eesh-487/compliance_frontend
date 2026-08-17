import { useCallback, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';

// Wraps useMutation with an AbortController so long-running (LLM-backed)
// mutations can be stopped from the UI. `runFn` must accept `{ signal }` and
// forward it to apiRequest (see api/client.js) for the stop to actually
// cancel the in-flight fetch rather than just ignoring its result.
export function useCancellableMutation(runFn, options = {}) {
  const controllerRef = useRef(null);

  const mutation = useMutation({
    ...options,
    mutationFn: () => {
      const controller = new AbortController();
      controllerRef.current = controller;
      return runFn({ signal: controller.signal });
    },
  });

  const stop = useCallback(() => {
    controllerRef.current?.abort();
  }, []);

  return { ...mutation, stop };
}
