'use client';

import { Button } from './ui/button';
import { AnimatePresence, motion } from 'framer-motion';

type GameSquareProps = {
  player: 1 | 2 | number;
  isDisabled?: boolean;
  className?: string;
  children?: React.ReactNode;
};

const draw = {
  hidden: { pathLength: 0 },
  visible: () => {
    return {
      pathLength: 1,
      transition: {
        pathLength: { type: 'spring', duration: 1, bounce: 0 },
      },
    };
  },
};

export default function GameSquare({
  isDisabled,
  className,
  player,
}: GameSquareProps) {
  function fillSquare() {
    switch (player) {
      case 1: {
        return (
          <>
            <motion.line
              x1="0"
              y1="0"
              x2="100%"
              y2="100%"
              variants={draw}
              strokeWidth={3}
              strokeLinecap="round"
              stroke="hsl(var(--primary))"
            />
            <motion.line
              x1="0"
              y1="100%"
              x2="100%"
              y2="0"
              variants={draw}
              strokeWidth={3}
              strokeLinecap="round"
              stroke="hsl(var(--primary))"
            />
          </>
        );
      }
      case 2: {
        return (
          <motion.circle
            cx="50%"
            cy="50%"
            r={`calc(50% - 3px)`}
            strokeWidth={3}
            stroke="hsl(var(--primary))"
            strokeLinecap="round"
            variants={draw}
          />
        );
      }
      default: {
        return null;
      }
    }
  }

  return (
    <Button
      disabled={isDisabled}
      className={`p-4 bg-background text-primary w-full h-full flex items-center justify-center ${className}`}
    >
      <motion.svg
        className="w-full h-full"
        // viewBox="0 0 100% 100%"
        xmlns="http://www.w3.org/2000/svg"
        initial="hidden"
        animate="visible"
        fill="none"
      >
        {fillSquare()}
      </motion.svg>
    </Button>
  );
}
