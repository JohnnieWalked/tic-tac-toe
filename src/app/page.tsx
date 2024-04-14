import GameField from '@/components/GameField';

export default function Home() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 place-items-center">
      <h2>Homepage</h2>
      <div className="w-max justify-center items-center">
        <GameField />
      </div>
    </section>
  );
}
