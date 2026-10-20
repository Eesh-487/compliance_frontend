import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getLlmConfig, updateLlmConfig } from '../api/llmConfig';

const LLM_CONFIG_KEY = ['llm-config'];

export function useLlmConfig() {
  const queryClient = useQueryClient();

  const configQuery = useQuery({
    queryKey: LLM_CONFIG_KEY,
    queryFn: getLlmConfig,
  });

  const saveMutation = useMutation({
    mutationFn: updateLlmConfig,
    onSuccess: (data) => queryClient.setQueryData(LLM_CONFIG_KEY, data),
  });

  return {
    ...configQuery,
    saveConfig: saveMutation.mutate,
    saveStatus: saveMutation.status,
    saveError: saveMutation.error,
  };
}
