'use client';
import { ANIMATION_TEMPLATE } from '@/constants';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

/* func-helpers */
import { calculateWinner } from '@/helpers/calculateWinner';

/* components */
import GameSquare from './GameSquare';
import Divider from './Divider';

/* styles */
import './GameField.css';

type GameFieldProps = {
  animateGameplay: boolean;
  disableClickSquare: boolean;
  templateGameField?: number[][];
};

export default function GameField({
  templateGameField,
  disableClickSquare,
  animateGameplay,
}: GameFieldProps) {
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameState, setGameState] = useState<number[][]>();

  // useEffect(() => {
  //   if (!animateGameplay && templateGameField) setGameState(templateGameField);
  // }, [animateGameplay, templateGameField]);

  /* animation of gameplay */
  useEffect(() => {
    async function animation() {
      await new Promise((r) => setTimeout(r, 4000));

      for (let i = 0; i < ANIMATION_TEMPLATE.length; i++) {
        setGameState((state) => (state = ANIMATION_TEMPLATE[i]));

        await new Promise((r) => setTimeout(r, 1200));

        const findWinner = calculateWinner(ANIMATION_TEMPLATE[i]);
        if (findWinner) {
          console.log(findWinner, 'player wins');
          return;
        }
      }
    }
    if (animateGameplay) animation();
  }, [animateGameplay]);

  /* end game */
  // useEffect(() => {
  //   if (calculateWinner(gameState)) setGameOver(true);
  // }, [gameState]);

  const renderedSquares = gameState?.flat().map((item, index) => {
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
