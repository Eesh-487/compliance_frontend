import { useMutation } from '@tanstack/react-query';
import { runGraphBuilder } from '../api/graphBuilder';

export function useGraphBuilder() {
  return useMutation({
    mutationFn: runGraphBuilder,
  });
}
