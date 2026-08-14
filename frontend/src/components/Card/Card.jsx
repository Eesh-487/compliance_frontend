import { useRef } from 'react';
import PropTypes from 'prop-types';
import { motion, useMotionValue, useSpring } from 'motion/react';
import styles from './Card.module.css';

function Card({ title, actions, children }) {
  const ref = useRef(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (event) => {
    const el = ref.current;
    if (!el) {
      return;
    }
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    rotateY.set((px - 0.5) * 8);
    rotateX.set((0.5 - py) * 8);
    el.style.setProperty('--spot-x', `${px * 100}%`);
    el.style.setProperty('--spot-y', `${py * 100}%`);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.section
      ref={ref}
      className={styles.card}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX: springRotateX, rotateY: springRotateY, transformPerspective: 800 }}
    >
      <div className={styles.spotlight} aria-hidden="true" />
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
