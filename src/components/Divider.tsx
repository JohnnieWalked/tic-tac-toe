'use client';

import { motion } from 'framer-motion';
/* styles */
import './Divider.css';

type DividerProps = {
  className: string;
  /** Set the delay of animation (in seconds). Default value - 1. */
  delay?: number;
  /** Set the diration of animation (in seconds). Default value - 2. */
  duration?: number;
  /** Choose direction of animation. Default value - fromTop. */
  direction?: 'fromTop' | 'fromBottom' | 'fromLeft' | 'fromRight';
};

export default function Divider({
  className,
  delay,
  duration,
  direction,
}: DividerProps) {
  function selectDirection(direction?: string) {
    switch (direction) {
      case 'fromBottom': {
        return {
          initial: {
            translateY: '102%',
          },
        };
      }
      case 'fromLeft': {
        return {
          initial: {
            translateX: '-102%',
          },
        };
      }
      case 'fromRight': {
        return {
          initial: {
            translateX: '102%',
          },
        };
      }
      default: {
        return {
          initial: {
            translateY: '-102%',
          },
        };
      }
    }
  }

  return (
    <motion.div
      initial={selectDirection(direction).initial}
      animate={{ translateY: '0%', translateX: '0%' }}
      transition={{
        delay: delay || 1,
        duration: duration || 2,
        ease: 'easeInOut',
      }}
      className={`divider bg-primary w-full h-full overflow-hidden rounded-full ${className}`}
    ></motion.div>
  );
}
