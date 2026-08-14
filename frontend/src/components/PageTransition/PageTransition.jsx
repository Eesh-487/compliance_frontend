import { AnimatePresence, motion } from 'motion/react';
import { useLocation, useOutlet } from 'react-router-dom';
import { EASE_OUT } from '../../lib/motion';
import styles from './PageTransition.module.css';

const pageVariants = {
  initial: { opacity: 0, scale: 1.03, filter: 'blur(6px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, scale: 0.98, filter: 'blur(4px)' },
};

function PageTransition() {
  const location = useLocation();
  const element = useOutlet();

  return (
    <>
      <motion.div
        key={`sweep-${location.pathname}`}
        className={styles.sweep}
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: [1, 1, 0] }}
        transition={{ duration: 0.55, times: [0, 0.65, 1], ease: EASE_OUT }}
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          className={styles.frame}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.45, ease: EASE_OUT }}
        >
          {element}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default PageTransition;
