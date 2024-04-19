'use client';

import { motion } from 'framer-motion';
import { draw } from './GameSquare';

type EndGameLineParams = {
  x1?: string;
  y1?: string;
  x2?: string;
  y2?: string;
};

export default function EndGameLine({ x1, x2, y1, y2 }: EndGameLineParams) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      initial="hidden"
      animate="visible"
      fill="none"
      className=" absolute w-full h-full"
    >
      <motion.line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        variants={draw}
        strokeWidth={5}
        strokeLinecap="round"
        stroke="hsl(var(--primary))"
        opacity={0.8}
      />
    </motion.svg>
  );
}
