// Motion language: fluid springs with a touch of elasticity on glass (the way
// Liquid Glass morphs), calm eases on content. MotionConfig reducedMotion="user"
// in main.jsx drops transforms for people who ask for reduced motion.
export const EASE_OUT = [0.22, 1, 0.36, 1];
export const SPRING_SNAPPY = { type: 'spring', stiffness: 500, damping: 40, mass: 0.4 };
export const SPRING_GLASS = { type: 'spring', stiffness: 380, damping: 28, mass: 0.8 };
export const SPRING_BOUNCY = SPRING_GLASS;

export const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};

export const scrollReveal = fadeUp;
export const scrollStagger = staggerContainer;
