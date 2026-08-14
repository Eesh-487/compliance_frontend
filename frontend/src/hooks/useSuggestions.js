import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  draftRemediation,
  getSuggestions,
  updateSuggestion,
} from '../api/remediation';

const SUGGESTIONS_KEY = ['remediation-suggestions'];

export function useSuggestions() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: SUGGESTIONS_KEY,
    queryFn: getSuggestions,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateSuggestion(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUGGESTIONS_KEY });
    },
  });

  return {
    ...query,
    updateSuggestion: updateMutation.mutate,
    updateSuggestionAsync: updateMutation.mutateAsync,
    updateStatus: updateMutation.status,
    updateError: updateMutation.error,
  };
}

export function useDraftRemediation() {
  return useMutation({
    mutationFn: draftRemediation,
  });
}
