'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ANIMATION_TEMPLATE } from '@/constants';

/* components */
import GameSquare from './GameSquare';
import Divider from './Divider';

/* styles */
import './GameField.css';

type GameFieldProps = {
  animateGameplay: boolean;
  disableClickSquare: boolean;
  templateGameField?: number[];
};

export default function GameField({
  templateGameField,
  disableClickSquare,
  animateGameplay,
}: GameFieldProps) {
  const [gameState, setGameState] = useState<number[]>([
    0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);

  useEffect(() => {
    if (!animateGameplay && templateGameField) setGameState(templateGameField);
  }, [animateGameplay, templateGameField]);

  /* animation of gameplay */
  useEffect(() => {
    async function animation() {
      await new Promise((r) => setTimeout(r, 4000));
      for (let i = 0; i < ANIMATION_TEMPLATE.length; i++) {
        setGameState(ANIMATION_TEMPLATE[i]);
        await new Promise((r) => setTimeout(r, 1200));
      }
    }
    animation();
  }, [animateGameplay]);

  const renderedSquares = gameState.map((item, index) => {
    return (
      <motion.div key={index} className={`square${index + 1} w-full h-full`}>
        {<GameSquare player={item} isDisabled={disableClickSquare} />}
      </motion.div>
    );
  });

  return (
    <motion.div className="game_field grid-cols-[100px_2px_100px_2px_100px] grid-rows-[100px_2px_100px_2px_100px] md:grid-cols-[125px_2px_125px_2px_125px] md:grid-rows-[125px_2px_125px_2px_125px] lg:grid-cols-[150px_2px_150px_2px_150px] lg:grid-rows-[150px_2px_150px_2px_150px] place-items-center items-center justify-center">
      {renderedSquares}
      <Divider className="divider1" />
      <Divider delay={1.1} direction="fromBottom" className="divider2" />
      <Divider delay={1.2} direction="fromLeft" className="divider3" />
      <Divider delay={1.3} direction="fromRight" className="divider4" />
    </motion.div>
  );
}
