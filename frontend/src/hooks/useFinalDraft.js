import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  finalizeDraft,
  getFinalDraft,
  updateFinalDraft,
} from '../api/remediation';

const FINAL_DRAFT_KEY = ['final-draft'];

export function useFinalDraft() {
  const queryClient = useQueryClient();

  const draftQuery = useQuery({
    queryKey: FINAL_DRAFT_KEY,
    queryFn: getFinalDraft,
  });

  const saveMutation = useMutation({
    mutationFn: (text) => updateFinalDraft(text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINAL_DRAFT_KEY });
    },
  });

  const finalizeMutation = useMutation({
    mutationFn: finalizeDraft,
  });

  return {
    ...draftQuery,
    saveDraft: saveMutation.mutate,
    saveDraftAsync: saveMutation.mutateAsync,
    saveStatus: saveMutation.status,
    saveError: saveMutation.error,
    finalize: finalizeMutation.mutate,
    finalizeAsync: finalizeMutation.mutateAsync,
    finalizeStatus: finalizeMutation.status,
    finalizeError: finalizeMutation.error,
    finalizeResult: finalizeMutation.data,
  };
}
