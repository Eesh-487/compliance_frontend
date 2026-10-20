import PropTypes from 'prop-types';
import styles from './Button.module.css';

// Liquid Glass buttons light up where the pointer is; set the position as CSS
// vars so no re-render happens on move.
function trackLight(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty('--light-x', `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty('--light-y', `${event.clientY - rect.top}px`);
}

function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
}) {
  const classNames = [styles.button, styles[variant], styles[size]].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      onClick={onClick}
      onPointerMove={trackLight}
    >
      {isLoading ? <span className={styles.spinner} aria-hidden="true" /> : null}
      <span className={styles.label}>{isLoading ? 'Working…' : children}</span>
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Button;
