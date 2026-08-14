import { useContext } from 'react';
import { PipelineRunContext } from '../context/pipelineRunContextObject';

export function usePipelineRun() {
  const ctx = useContext(PipelineRunContext);
  if (!ctx) {
    throw new Error('usePipelineRun must be used within a PipelineRunProvider');
  }
  return ctx;
}
