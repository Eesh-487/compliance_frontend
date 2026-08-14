import PropTypes from 'prop-types';
import { motion } from 'motion/react';
import { EASE_OUT, wordContainer, wordReveal } from '../../lib/motion';
import styles from './PageHeader.module.css';

function PageHeader({ eyebrow, title, description }) {
  const words = title.split(' ');

  return (
    <header className={styles.header}>
      {eyebrow ? (
        <motion.p
          className={styles.eyebrow}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <span>{eyebrow}</span>
          <motion.span
            className={styles.eyebrowLine}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.15 }}
          />
        </motion.p>
      ) : null}

      <motion.h2 className={styles.title} variants={wordContainer} initial="hidden" animate="visible">
        {words.map((word, index) => {
          const text = index < words.length - 1 ? `${word} ` : word;
          return (
            <motion.span key={`${word}-${index}`} className={styles.word} variants={wordReveal}>
              {text}
            </motion.span>
          );
        })}
      </motion.h2>

      {description ? (
        <motion.p
          className={styles.description}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.3 }}
        >
          {description}
        </motion.p>
      ) : null}
    </header>
  );
}

PageHeader.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
};

export default PageHeader;
