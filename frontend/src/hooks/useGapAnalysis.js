import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { runGapAnalysis } from '../api/gapAnalysis';

const GAP_ANALYSIS_CACHE_KEY = ['gap-analysis-last-result'];
const GAP_ANALYSIS_STORAGE_KEY = 'gap-analysis-last-result';

function readStoredResult() {
  try {
    const raw = window.localStorage.getItem(GAP_ANALYSIS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStoredResult(data) {
  try {
    window.localStorage.setItem(GAP_ANALYSIS_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage write failures.
  }
}

export function useGapAnalysis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: runGapAnalysis,
    onSuccess: (data) => {
      queryClient.setQueryData(GAP_ANALYSIS_CACHE_KEY, data);
      writeStoredResult(data);
    },
  });
}

export function useGapAnalysisResult() {
  return useQuery({
    queryKey: GAP_ANALYSIS_CACHE_KEY,
    queryFn: () => readStoredResult(),
    initialData: readStoredResult,
    staleTime: Infinity,
  });
}
