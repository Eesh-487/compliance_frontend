import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { runGraphBuilder } from '../api/graphBuilder';
import { runLawIngest } from '../api/lawIngest';
import { draftRemediation } from '../api/remediation';

const SUGGESTIONS_KEY = ['remediation-suggestions'];

const STEP_DEFS = [
  { key: 'graphBuilder', label: 'Build Policy Graph' },
  { key: 'lawIngest', label: 'Ingest Law Corpus' },
  { key: 'humanUpload', label: 'Add Your Documents' },
  { key: 'draft', label: 'Draft Suggestions' },
];

function initialSteps() {
  return STEP_DEFS.map((def) => ({ ...def, status: 'pending', error: null }));
}

export function useReviewOrchestration() {
  const [steps, setSteps] = useState(initialSteps);
  const [hasStarted, setHasStarted] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const setStepStatus = useCallback((key, status, error = null) => {
    setSteps((prev) => prev.map((step) => (step.key === key ? { ...step, status, error } : step)));
  }, []);

  const runGraphBuilderStep = useCallback(async () => {
    setStepStatus('graphBuilder', 'running');
    try {
      await runGraphBuilder();
      setStepStatus('graphBuilder', 'done');
      return true;
    } catch (error) {
      setStepStatus('graphBuilder', 'failed', error?.message || 'Graph Builder failed.');
      return false;
    }
  }, [setStepStatus]);

  const runLawIngestStep = useCallback(async () => {
    setStepStatus('lawIngest', 'running');
    try {
      await runLawIngest();
      setStepStatus('lawIngest', 'done');
      setStepStatus('humanUpload', 'active');
      return true;
    } catch (error) {
      setStepStatus('lawIngest', 'failed', error?.message || 'Law Ingest failed.');
      return false;
    }
  }, [setStepStatus]);

  const runDraftStep = useCallback(async () => {
    setStepStatus('draft', 'running');
    try {
      const result = await draftRemediation();
      setStepStatus('draft', 'done');
      queryClient.setQueryData(SUGGESTIONS_KEY, result);
      navigate('/review/suggestions');
      return true;
    } catch (error) {
      setStepStatus('draft', 'failed', error?.message || 'Draft Remediation failed.');
      return false;
    }
  }, [setStepStatus, queryClient, navigate]);

  const start = useCallback(async () => {
    setHasStarted(true);
    setSteps(initialSteps());
    const graphOk = await runGraphBuilderStep();
    if (!graphOk) {
      return;
    }
    await runLawIngestStep();
  }, [runGraphBuilderStep, runLawIngestStep]);

  const retryStep = useCallback(
    async (key) => {
      if (key === 'graphBuilder') {
        const ok = await runGraphBuilderStep();
        if (!ok) {
          return;
        }
        await runLawIngestStep();
        return;
      }

      if (key === 'lawIngest') {
        await runLawIngestStep();
        return;
      }

      if (key === 'draft') {
        await runDraftStep();
      }
    },
    [runGraphBuilderStep, runLawIngestStep, runDraftStep],
  );

  const continueAfterUpload = useCallback(async () => {
    setStepStatus('humanUpload', 'done');
    await runDraftStep();
  }, [setStepStatus, runDraftStep]);

  const failedStep = steps.find((step) => step.status === 'failed');
  const isAwaitingUpload = steps.find((step) => step.key === 'humanUpload')?.status === 'active';
  const isRunning = steps.some((step) => step.status === 'running');
  const isComplete = steps.every((step) => step.status === 'done');

  return {
    steps,
    hasStarted,
    start,
    retryStep,
    continueAfterUpload,
    failedStep,
    isAwaitingUpload,
    isRunning,
    isComplete,
  };
}
