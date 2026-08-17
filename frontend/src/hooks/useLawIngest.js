import { useCancellableMutation } from './useCancellableMutation';
import { runLawIngest } from '../api/lawIngest';

export function useLawIngest() {
  return useCancellableMutation(runLawIngest);
}
