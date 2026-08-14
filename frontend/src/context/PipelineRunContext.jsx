import PropTypes from 'prop-types';
import { useGraphBuilder } from '../hooks/useGraphBuilder';
import { useLawIngest } from '../hooks/useLawIngest';
import { useGapAnalysis } from '../hooks/useGapAnalysis';
import { useDocumentUpload } from '../hooks/useDocumentUpload';
import { useReviewOrchestration } from '../hooks/useReviewOrchestration';
import { PipelineRunContext } from './pipelineRunContextObject';

// Owns every long-running pipeline mutation (and the guided-review
// orchestration) at a level above <Routes>, so this state survives
// navigating to another page and back - the mutations otherwise live and
// die with whichever page component called useMutation(), even though the
// underlying request keeps running server-side regardless.
export function PipelineRunProvider({ children }) {
  const graphBuilder = useGraphBuilder();
  const lawIngest = useLawIngest();
  const gapAnalysis = useGapAnalysis();
  const uploadDocument = useDocumentUpload();
  const orchestration = useReviewOrchestration();

  return (
    <PipelineRunContext.Provider
      value={{ graphBuilder, lawIngest, gapAnalysis, uploadDocument, orchestration }}
    >
      {children}
    </PipelineRunContext.Provider>
  );
}

PipelineRunProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
