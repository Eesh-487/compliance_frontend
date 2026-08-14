import { motion } from 'motion/react';
import Badge from '../../components/Badge/Badge';
import Card from '../../components/Card/Card';
import PageHeader from '../../components/PageHeader/PageHeader';
import PipelineStageCard from '../../components/PipelineStageCard/PipelineStageCard';
import { scrollReveal, scrollStagger } from '../../lib/motion';
import { useGapAnalysisResult } from '../../hooks/useGapAnalysis';
import { usePipelineRun } from '../../hooks/usePipelineRun';
import styles from './GapAnalysisPage.module.css';

function GapAnalysisPage() {
  const { gapAnalysis } = usePipelineRun();
  const { data } = useGapAnalysisResult();
  const gaps = data?.final_gaps || [];

  return (
    <section className={styles.page}>
      <PageHeader
        eyebrow="Pipeline · Manual"
        title="Gap Analysis"
        description="Compares current policy text against ingested law and identifies compliance gaps, in isolation from the guided review flow. Shows the most recent result below."
      />

      <PipelineStageCard
        title="Gap Analysis"
        description="Compares current policy text against law and identifies compliance gaps."
        mutation={gapAnalysis}
        buttonText="Run Gap Analysis"
      />

      {gaps.length === 0 ? (
        <Card>
          <p className={styles.empty}>No gap analysis results yet. Run it above, or from Start Compliance Review.</p>
        </Card>
      ) : (
        <motion.div
          className={styles.list}
          variants={scrollStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {gaps.map((gap, index) => (
            <motion.div key={gap.id || gap.gap_id || index} variants={scrollReveal}>
              <Card>
                <article className={styles.gapCard}>
                  <div className={styles.topRow}>
                    <h3>{gap.title || gap.gap_title || 'Untitled Gap'}</h3>
                    <Badge value={gap.severity || 'low'} kind="severity" />
                  </div>

                  <p className={styles.description}>
                    {gap.description || 'No description provided by backend.'}
                  </p>

                  <div className={styles.metaSection}>
                    <h4>Cited Law Sections</h4>
                    <ul>
                      {(gap.cited_law_sections || gap.cited_sections || []).map((section, sectionIndex) => (
                        <li key={`${section}-${sectionIndex}`}>{section}</li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.metaSection}>
                    <h4>Related Entities</h4>
                    <ul>
                      {(gap.related_entities || []).map((entity, entityIndex) => (
                        <li key={`${entity}-${entityIndex}`}>{entity}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}

export default GapAnalysisPage;
