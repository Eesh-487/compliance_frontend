import { useCancellableMutation } from './useCancellableMutation';
import { runGraphBuilder } from '../api/graphBuilder';

export function useGraphBuilder() {
  return useCancellableMutation(runGraphBuilder);
}
