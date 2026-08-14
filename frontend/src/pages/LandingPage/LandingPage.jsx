import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import DocumentDropzone from '../../components/DocumentDropzone/DocumentDropzone';
import PageHeader from '../../components/PageHeader/PageHeader';
import Stepper from '../../components/Stepper/Stepper';
import { usePipelineRun } from '../../hooks/usePipelineRun';
import styles from './LandingPage.module.css';

function LandingPage() {
  const { orchestration, uploadDocument } = usePipelineRun();
  const { steps, hasStarted, start, retryStep, continueAfterUpload, failedStep, isAwaitingUpload } =
    orchestration;

  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleUploaded = (result, file) => {
    setUploadedFiles((prev) => [...prev, file.name]);
  };

  const runningStep = steps.find((step) => step.status === 'running');

  return (
    <section className={styles.page}>
      <PageHeader
        eyebrow="Compliance Review"
        title="Start Compliance Review"
        description="Runs the full pipeline end to end — policy graph, law corpus, your documents, and a drafted suggestion for every gap found."
      />

      {!hasStarted ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <div className={styles.startBody}>
              <p className={styles.startCopy}>
                This builds the compliance knowledge graph from your policy, ingests the DPDP Act corpus,
                gives you a chance to add supporting documents, then drafts a reviewable suggestion for
                every gap found — landing you directly in the review queue.
              </p>
              <Button size="lg" onClick={start}>
                Start Compliance Review
              </Button>
            </div>
          </Card>
        </motion.div>
      ) : (
        <div className={styles.flow}>
          <Card>
            <Stepper steps={steps} />
          </Card>

          <AnimatePresence mode="wait">
            {failedStep ? (
              <motion.div
                key="failed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Card title={`${failedStep.label} failed`}>
                  <div className={styles.panelBody}>
                    <p className={styles.errorText}>
                      {failedStep.error || 'Something went wrong running this step.'}
                    </p>
                    <Button variant="primary" onClick={() => retryStep(failedStep.key)}>
                      Retry this step
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ) : isAwaitingUpload ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Card title="Add supporting documents (optional)">
                  <div className={styles.panelBody}>
                    <p className={styles.hint}>
                      Upload any additional policy documents to include in gap analysis. Each file is
                      embedded and searchable as soon as it finishes uploading. Nothing proceeds until you
                      click Continue — skip straight through if you have nothing to add.
                    </p>
                    <DocumentDropzone upload={uploadDocument} onUploaded={handleUploaded} />
                    {uploadedFiles.length > 0 ? (
                      <ul className={styles.uploadedList}>
                        {uploadedFiles.map((name, index) => (
                          <li key={`${name}-${index}`}>{name}</li>
                        ))}
                      </ul>
                    ) : null}
                    <Button variant="primary" onClick={continueAfterUpload}>
                      Continue
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ) : runningStep ? (
              <motion.div
                key="running"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Card>
                  <p className={styles.hint}>
                    Running {runningStep.label.toLowerCase()}. This can take several minutes for LLM-backed
                    stages.
                  </p>
                </Card>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}

export default LandingPage;
