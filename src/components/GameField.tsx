'use client';
import { ANIMATION_TEMPLATE, FIELD_SIZE } from '@/constants';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

/* func-helpers */
import { calculateWinner } from '@/helpers/calculateWinner';

/* components */
import GameSquare from './GameSquare';
import Divider from './Divider';

/* styles */
import './GameField.css';
import EndGameLine from './EndGameLine';

type GameFieldProps = {
  animateGameplay: boolean;
  disableClickSquare: boolean;
  templateGameField?: number[][];
};

type EndLinePosition = {
  x1: string;
  y1: string;
  x2: string;
  y2: string;
};

export default function GameField({
  templateGameField,
  disableClickSquare,
  animateGameplay,
}: GameFieldProps) {
  const [endLinePosition, setEndLinePosition] = useState<EndLinePosition>();
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

        const findWinner = calculateWinner(ANIMATION_TEMPLATE[i], FIELD_SIZE);
        if (findWinner?.winner) {
          console.log(findWinner.winner, 'player wins');
          console.log(findWinner.endGameAnimationStartFrom);
          setGameOver(true);
          setEndLinePosition(findWinner.endGameAnimationStartFrom);
          return;
        }
      }
    }
    if (animateGameplay) animation();
  }, [animateGameplay]);

  /* end game */
  useEffect(() => {
    async function gg() {
      if (gameState && calculateWinner(gameState, FIELD_SIZE)) {
        await new Promise((r) => setTimeout(r, 1200));
        setGameOver(true);
      }
    }

    if (!animateGameplay) gg();
  }, [animateGameplay, gameState]);

  const renderedSquares = gameState?.flat().map((item, index) => {
    return (
      <motion.div key={index} className={`square${index + 1} w-full h-full`}>
        {<GameSquare player={item} isDisabled={disableClickSquare} />}
      </motion.div>
    );
  });

  return (
    <motion.div className="game_field relative grid-cols-[100px_2px_100px_2px_100px] grid-rows-[100px_2px_100px_2px_100px] md:grid-cols-[125px_2px_125px_2px_125px] md:grid-rows-[125px_2px_125px_2px_125px] lg:grid-cols-[150px_2px_150px_2px_150px] lg:grid-rows-[150px_2px_150px_2px_150px] place-items-center items-center justify-center">
      {renderedSquares}
      <Divider className="divider1" />
      <Divider delay={1.1} direction="fromBottom" className="divider2" />
      <Divider delay={1.2} direction="fromLeft" className="divider3" />
      <Divider delay={1.3} direction="fromRight" className="divider4" />
      {gameOver && (
        <EndGameLine
          x1={endLinePosition?.x1}
          x2={endLinePosition?.x2}
          y1={endLinePosition?.y1}
          y2={endLinePosition?.y2}
        />
      )}
    </motion.div>
  );
}
