import { useRef } from 'react';
import PropTypes from 'prop-types';
import { motion, useMotionValue, useSpring } from 'motion/react';
import styles from './Button.module.css';

function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
}) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.5 });

  const classNames = [styles.button, styles[variant], styles[size]].filter(Boolean).join(' ');

  const isDisabled = disabled || isLoading;

  const handleMouseMove = (event) => {
    if (isDisabled || !ref.current) {
      return;
    }
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * 0.25);
    y.set((event.clientY - (rect.top + rect.height / 2)) * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      className={classNames}
      disabled={isDisabled}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ translateX: springX, translateY: springY }}
      whileTap={isDisabled ? undefined : { scale: 0.96 }}
    >
      {isLoading ? 'Working...' : children}
    </motion.button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Button;
