import PageHeader from '../../components/PageHeader/PageHeader';
import PipelineStageCard from '../../components/PipelineStageCard/PipelineStageCard';
import { usePipelineRun } from '../../hooks/usePipelineRun';
import styles from './PipelineGraphBuilderPage.module.css';

function PipelineGraphBuilderPage() {
  const { graphBuilder } = usePipelineRun();

  return (
    <section className={styles.page}>
      <PageHeader
        eyebrow="Pipeline · Manual"
        title="Graph Builder"
        description="Extracts the company's policy into entities and relationships and writes the graph to Neo4j. For isolated re-runs and debugging outside the guided review flow."
      />

      <PipelineStageCard
        title="Graph Builder"
        description="Builds or refreshes the compliance knowledge graph from source entities."
        mutation={graphBuilder}
        buttonText="Run Graph Builder"
      />
    </section>
  );
}

export default PipelineGraphBuilderPage;
