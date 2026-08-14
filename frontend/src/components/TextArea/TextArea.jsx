import PropTypes from 'prop-types';
import styles from './TextArea.module.css';

function TextArea({
  id,
  label,
  value,
  onChange,
  rows = 8,
  placeholder = '',
  mono = false,
}) {
  return (
    <label className={styles.wrapper} htmlFor={id}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <textarea
        id={id}
        className={`${styles.textarea} ${mono ? styles.mono : ''}`}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
      />
    </label>
  );
}

TextArea.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  rows: PropTypes.number,
  placeholder: PropTypes.string,
  mono: PropTypes.bool,
};

export default TextArea;
