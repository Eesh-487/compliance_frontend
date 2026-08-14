import { useMutation } from '@tanstack/react-query';
import { ingestDocument } from '../api/documents';

export function useDocumentUpload() {
  return useMutation({
    mutationFn: ingestDocument,
  });
}
