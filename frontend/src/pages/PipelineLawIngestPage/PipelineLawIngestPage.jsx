import PageHeader from '../../components/PageHeader/PageHeader';
import PipelineStageCard from '../../components/PipelineStageCard/PipelineStageCard';
import { usePipelineRun } from '../../hooks/usePipelineRun';
import styles from './PipelineLawIngestPage.module.css';

function PipelineLawIngestPage() {
  const { lawIngest } = usePipelineRun();

  return (
    <section className={styles.page}>
      <PageHeader
        eyebrow="Pipeline · Manual"
        title="Law Ingest"
        description="Ingests the default law corpus (DPDP Act) already known to the system. For isolated re-runs and debugging outside the guided review flow."
      />

      <PipelineStageCard
        title="Law Ingest"
        description="Ingests legal corpus and prepares chunks used by downstream analysis."
        mutation={lawIngest}
        buttonText="Run Law Ingest"
      />
    </section>
  );
}

export default PipelineLawIngestPage;
