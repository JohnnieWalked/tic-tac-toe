import GameSquare from './GameSquare';

export default function GameField() {
  return (
    <section className="grid grid-cols-[repeat(3,_100px)] grid-rows-[repeat(3,_100px)] md:grid-cols-[repeat(3,_125px)] md:grid-rows-[repeat(3,_125px)] lg:grid-cols-[repeat(3,_150px)] lg:grid-rows-[repeat(3,_150px)] place-items-center items-center justify-center bg-foreground gap-1">
      <GameSquare />
      <GameSquare />
      <GameSquare />
      <GameSquare />
      <GameSquare />
      <GameSquare />
      <GameSquare />
      <GameSquare />
      <GameSquare />
    </section>
  );
}
