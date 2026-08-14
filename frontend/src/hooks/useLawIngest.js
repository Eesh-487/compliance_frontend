import { useMutation } from '@tanstack/react-query';
import { runLawIngest } from '../api/lawIngest';

export function useLawIngest() {
  return useMutation({
    mutationFn: runLawIngest,
  });
}
