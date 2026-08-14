import PropTypes from 'prop-types';
import styles from './DiffLine.module.css';

function DiffLine({ line }) {
  if (!line) {
    return null;
  }

  const isAddition = line.startsWith('+') && !line.startsWith('+++');
  const isRemoval = line.startsWith('-') && !line.startsWith('---');
  const lineClass = isAddition ? styles.addition : isRemoval ? styles.removal : styles.neutral;

  return <pre className={`${styles.line} ${lineClass}`}>{line}</pre>;
}

DiffLine.propTypes = {
  line: PropTypes.string,
};

export default DiffLine;
