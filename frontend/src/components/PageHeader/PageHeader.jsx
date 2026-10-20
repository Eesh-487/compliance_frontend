import PropTypes from 'prop-types';
import { motion, useScroll, useTransform } from 'motion/react';
import { EASE_OUT } from '../../lib/motion';
import styles from './PageHeader.module.css';

// Large title that hands off to a compact glass title bar once scrolled past,
// the way iOS/macOS navigation bars collapse their large titles.
function PageHeader({ eyebrow, title, description }) {
  const { scrollY } = useScroll();
  const largeOpacity = useTransform(scrollY, [0, 80], [1, 0]);
  const largeScale = useTransform(scrollY, [0, 80], [1, 0.96]);
  const barOpacity = useTransform(scrollY, [60, 110], [0, 1]);
  const barY = useTransform(scrollY, [60, 110], [-12, 0]);

  return (
    <header className={styles.header}>
      <motion.div
        className={`glass ${styles.compactBar}`}
        style={{ opacity: barOpacity, y: barY }}
        aria-hidden="true"
      >
        <span className={styles.compactTitle}>{title}</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
      >
        <motion.div className={styles.large} style={{ opacity: largeOpacity, scale: largeScale }}>
          {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
          <h2 className={styles.title}>{title}</h2>
          {description ? <p className={styles.description}>{description}</p> : null}
        </motion.div>
      </motion.div>
    </header>
  );
}

PageHeader.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
};

export default PageHeader;
