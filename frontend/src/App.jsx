import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Spinner from './components/Spinner/Spinner';
import { PipelineRunProvider } from './context/PipelineRunContext';
import LandingPage from './pages/LandingPage/LandingPage';
import PipelineGraphBuilderPage from './pages/PipelineGraphBuilderPage/PipelineGraphBuilderPage';
import PipelineLawIngestPage from './pages/PipelineLawIngestPage/PipelineLawIngestPage';
import DocumentsPage from './pages/DocumentsPage/DocumentsPage';
import GapAnalysisPage from './pages/GapAnalysisPage/GapAnalysisPage';
import SuggestionsPage from './pages/SuggestionsPage/SuggestionsPage';
import FinalDraftPage from './pages/FinalDraftPage/FinalDraftPage';
import HistoryPage from './pages/HistoryPage/HistoryPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';

const GraphExplorerPage = lazy(() => import('./pages/GraphExplorerPage/GraphExplorerPage'));

function App() {
  return (
    <PipelineRunProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pipeline/graph-builder" element={<PipelineGraphBuilderPage />} />
          <Route path="/pipeline/law-ingest" element={<PipelineLawIngestPage />} />
          <Route path="/pipeline/documents" element={<DocumentsPage />} />
          <Route path="/pipeline/gap-analysis" element={<GapAnalysisPage />} />
          <Route
            path="/pipeline/graph-explorer"
            element={
              <Suspense fallback={<Spinner label="Loading graph explorer..." />}>
                <GraphExplorerPage />
              </Suspense>
            }
          />
          <Route path="/review/suggestions" element={<SuggestionsPage />} />
          <Route path="/review/final-draft" element={<FinalDraftPage />} />
          <Route path="/review/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PipelineRunProvider>
  );
}

export default App;
