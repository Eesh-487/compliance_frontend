import { AnimatePresence, motion } from 'motion/react';
import { useLocation, useOutlet } from 'react-router-dom';
import { EASE_OUT } from '../../lib/motion';
import styles from './PageTransition.module.css';

function PageTransition() {
  const location = useLocation();
  const element = useOutlet();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        className={styles.frame}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } }}
        exit={{ opacity: 0, y: -6, transition: { duration: 0.15, ease: EASE_OUT } }}
      >
        {element}
      </motion.div>
    </AnimatePresence>
  );
}

export default PageTransition;
