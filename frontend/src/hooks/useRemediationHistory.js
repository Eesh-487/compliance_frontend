import { useMutation, useQuery } from '@tanstack/react-query';
import { getRemediationDiff, getRemediationHistory } from '../api/remediation';

const HISTORY_KEY = ['remediation-history'];

export function useRemediationHistory(limit = 20) {
  return useQuery({
    queryKey: [...HISTORY_KEY, limit],
    queryFn: () => getRemediationHistory(limit),
  });
}

export function useRemediationDiff() {
  return useMutation({
    mutationFn: ({ fromRev, toRev }) => getRemediationDiff(fromRev, toRev),
  });
}
