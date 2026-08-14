import PropTypes from 'prop-types';
import styles from './Badge.module.css';

const SEVERITY_MAP = {
  critical: styles.severityCritical,
  high: styles.severityHigh,
  medium: styles.severityMedium,
  low: styles.severityLow,
};

const STATUS_MAP = {
  pending: styles.statusPending,
  accepted: styles.statusAccepted,
  rejected: styles.statusRejected,
  edited: styles.statusEdited,
};

function Badge({ value, kind = 'status' }) {
  const normalized = String(value || '').toLowerCase();
  const kindClass = kind === 'severity' ? SEVERITY_MAP[normalized] : STATUS_MAP[normalized];

  return (
    <span className={`${styles.badge} ${kindClass || styles.defaultBadge}`}>
      {normalized || 'unknown'}
    </span>
  );
}

Badge.propTypes = {
  value: PropTypes.string,
  kind: PropTypes.oneOf(['status', 'severity']),
};

export default Badge;
