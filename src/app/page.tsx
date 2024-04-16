import GameField from '@/components/GameField';
import UsernameForm from '@/components/UsernameForm';

export default function Home() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 place-items-center">
      <div className="flex flex-col gap-10">
        <h2 className="italic text-4xl">
          Welcome to <span className=" not-italic ">Tic-tac-toe!</span>
        </h2>
        <div className=" text-xl">
          Before proceed, please, make sure You entered your username and
          familiar with game rules. If not, visit <q>How to play</q> page.
        </div>
        <UsernameForm />
      </div>
      <div className="w-max overflow-hidden">
        <GameField />
      </div>
    </section>
  );
}
