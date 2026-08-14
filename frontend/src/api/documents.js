import { apiRequest } from './client';

export function ingestDocument(file) {
  const formData = new FormData();
  formData.append('file', file);

  return apiRequest('/documents/ingest', {
    method: 'POST',
    body: formData,
    isFormData: true,
  });
}
