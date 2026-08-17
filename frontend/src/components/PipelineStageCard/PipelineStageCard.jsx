import PropTypes from 'prop-types';
import { motion } from 'motion/react';
import Badge from '../Badge/Badge';
import Button from '../Button/Button';
import Card from '../Card/Card';
import Spinner from '../Spinner/Spinner';
import { scrollReveal } from '../../lib/motion';
import styles from './PipelineStageCard.module.css';

function summarizeResult(data) {
  if (!data) {
    return [];
  }

  return Object.entries(data)
    .filter(([key, value]) => key !== 'status' && ['string', 'number', 'boolean'].includes(typeof value))
    .slice(0, 5);
}

function PipelineStageCard({ title, description, mutation, buttonText }) {
  const summary = summarizeResult(mutation.data);

  return (
    <motion.div variants={scrollReveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <Card title={title}>
        <div className={styles.stageBody}>
          <p className={styles.description}>{description}</p>

          <div className={styles.statusRow}>
            <span className={styles.statusLabel}>Status:</span>
            <Badge value={mutation.status} kind="status" />
          </div>

          {mutation.isPending ? (
            <div className={styles.loadingBlock}>
              <Spinner label="Processing. This can take several minutes for LLM stages." />
            </div>
          ) : null}

          {mutation.isError ? (
            <p className={mutation.error?.aborted ? styles.stoppedText : styles.errorText}>
              {mutation.error?.aborted
                ? 'Stopped before it finished.'
                : mutation.error?.message || 'Request failed.'}
            </p>
          ) : null}

          {mutation.isSuccess && summary.length > 0 ? (
            <ul className={styles.summaryList}>
              {summary.map(([key, value]) => (
                <li key={key}>
                  <span className={styles.summaryKey}>{key}</span>
                  <span>{String(value)}</span>
                </li>
              ))}
            </ul>
          ) : null}

          <div className={styles.buttonRow}>
            <Button variant="primary" isLoading={mutation.isPending} onClick={() => mutation.mutate()}>
              {buttonText}
            </Button>

            {mutation.isPending ? (
              <Button variant="danger" onClick={mutation.stop}>
                Stop
              </Button>
            ) : null}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

PipelineStageCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  mutation: PropTypes.shape({
    status: PropTypes.string,
    data: PropTypes.object,
    error: PropTypes.shape({ message: PropTypes.string }),
    isPending: PropTypes.bool,
    isError: PropTypes.bool,
    isSuccess: PropTypes.bool,
    mutate: PropTypes.func.isRequired,
    stop: PropTypes.func.isRequired,
  }).isRequired,
  buttonText: PropTypes.string.isRequired,
};

export default PipelineStageCard;
