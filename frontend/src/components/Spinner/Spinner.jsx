import PropTypes from 'prop-types';
import styles from './Spinner.module.css';

function Spinner({ label = 'Loading...' }) {
  return (
    <div className={styles.container} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </div>
  );
}

Spinner.propTypes = {
  label: PropTypes.string,
};

export default Spinner;
