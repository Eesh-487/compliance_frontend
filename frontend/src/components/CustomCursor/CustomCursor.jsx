import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import styles from './CustomCursor.module.css';

function CustomCursor() {
  const [isReady, setIsReady] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 500, damping: 40, mass: 0.4 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isFinePointer || prefersReducedMotion) {
      return undefined;
    }

    document.body.classList.add('cursor-ready');
    setIsReady(true);

    const handleMove = (event) => {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
    };

    const handleOver = (event) => {
      setIsHovering(Boolean(event.target.closest('a, button, [role="button"], [data-cursor-hover]')));
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseover', handleOver);

    return () => {
      document.body.classList.remove('cursor-ready');
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handleOver);
    };
  }, [cursorX, cursorY]);

  if (!isReady) {
    return null;
  }

  return (
    <motion.div
      className={`${styles.cursor} ${isHovering ? styles.cursorHover : ''}`}
      style={{ translateX: springX, translateY: springY }}
      aria-hidden="true"
    />
  );
}

export default CustomCursor;
