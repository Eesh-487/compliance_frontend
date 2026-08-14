export const EASE_OUT = [0.16, 1, 0.3, 1];
export const SPRING_BOUNCY = { type: 'spring', stiffness: 420, damping: 26, mass: 0.7 };
export const SPRING_SNAPPY = { type: 'spring', stiffness: 500, damping: 40, mass: 0.4 };

export const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE_OUT },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

/** For whileInView scroll-triggered reveals on list/grid items. */
export const scrollReveal = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: SPRING_BOUNCY,
  },
};

export const scrollStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

/** Per-word variant for the PageHeader hero title reveal. */
export const wordReveal = {
  hidden: { opacity: 0, y: 24, rotateX: -40 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: SPRING_BOUNCY,
  },
};

export const wordContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.045, delayChildren: 0.05 },
  },
};
