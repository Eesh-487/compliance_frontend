import PropTypes from 'prop-types';
import { motion } from 'motion/react';
import { fadeUp } from '../../lib/motion';
import styles from './Card.module.css';

function Card({ title, actions, children }) {
  return (
    <motion.section
      className={styles.card}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
    >
      {(title || actions) && (
        <header className={styles.header}>
          {title ? <h3 className={styles.title}>{title}</h3> : <span />}
          {actions ? <div className={styles.actions}>{actions}</div> : null}
        </header>
      )}
      <div className={styles.content}>{children}</div>
    </motion.section>
  );
}

Card.propTypes = {
  title: PropTypes.string,
  actions: PropTypes.node,
  children: PropTypes.node.isRequired,
};

export default Card;
