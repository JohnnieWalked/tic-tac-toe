'use client';
import { motion } from 'framer-motion';

/* components */
import GameSquare from './GameSquare';
import Divider from './Divider';

/* styles */
import './GameField.css';

export default function GameField() {
  return (
    <motion.div className="game_field grid-cols-[100px_2px_100px_2px_100px] grid-rows-[100px_2px_100px_2px_100px] md:grid-cols-[125px_2px_125px_2px_125px] md:grid-rows-[125px_2px_125px_2px_125px] lg:grid-cols-[150px_2px_150px_2px_150px] lg:grid-rows-[150px_2px_150px_2px_150px] place-items-center items-center justify-center">
      <GameSquare className="square1" />
      <GameSquare className="square2" />
      <GameSquare className="square3" />
      <GameSquare className="square4" />
      <GameSquare className="square5" />
      <GameSquare className="square6" />
      <GameSquare className="square7" />
      <GameSquare className="square8" />
      <GameSquare className="square9" />
      <Divider className="divider1" />
      <Divider delay={1.1} direction="fromBottom" className="divider2" />
      <Divider delay={1.2} direction="fromLeft" className="divider3" />
      <Divider delay={1.3} direction="fromRight" className="divider4" />
    </motion.div>
  );
}
