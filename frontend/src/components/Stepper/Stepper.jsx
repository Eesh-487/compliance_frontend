import PropTypes from 'prop-types';
import { motion } from 'motion/react';
import { SPRING_BOUNCY } from '../../lib/motion';
import styles from './Stepper.module.css';

function StepIcon({ status, index }) {
  if (status === 'done') {
    return (
      <motion.span
        className={`${styles.icon} ${styles.iconDone}`}
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={SPRING_BOUNCY}
      >
        ✓
      </motion.span>
    );
  }

  if (status === 'failed') {
    return (
      <motion.span
        className={`${styles.icon} ${styles.iconFailed}`}
        initial={{ x: 0 }}
        animate={{ x: [0, -4, 4, -3, 3, 0] }}
        transition={{ duration: 0.4 }}
      >
        !
      </motion.span>
    );
  }

  if (status === 'stopped') {
    return (
      <span className={`${styles.icon} ${styles.iconStopped}`}>
        <span className={styles.stoppedSquare} />
      </span>
    );
  }

  if (status === 'running') {
    return (
      <span className={`${styles.icon} ${styles.iconRunning}`}>
        <span className={styles.spinnerRing} />
      </span>
    );
  }

  if (status === 'active') {
    return (
      <span className={`${styles.icon} ${styles.iconActive}`}>
        <motion.span
          className={styles.activeDot}
          animate={{ opacity: [1, 0.4, 1], scale: [1, 0.85, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </span>
    );
  }

  return <span className={`${styles.icon} ${styles.iconPending}`}>{index + 1}</span>;
}

function Stepper({ steps }) {
  return (
    <ol className={styles.track}>
      {steps.map((step, index) => (
        <li key={step.key} className={styles.step}>
          {index > 0 ? (
            <span className={styles.connector}>
              <motion.span
                className={styles.connectorFill}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: steps[index - 1].status === 'done' ? 1 : 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </span>
          ) : null}

          <StepIcon status={step.status} index={index} />
          <span
            className={`${styles.label} ${step.status === 'failed' ? styles.labelFailed : ''} ${
              step.status === 'stopped' ? styles.labelStopped : ''
            }`}
          >
            {step.label}
          </span>
          {step.status === 'failed' && step.error ? (
            <span className={styles.errorCaption}>{step.error}</span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

Stepper.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      status: PropTypes.oneOf(['pending', 'running', 'active', 'done', 'failed', 'stopped']).isRequired,
      error: PropTypes.string,
    }),
  ).isRequired,
};

export default Stepper;
