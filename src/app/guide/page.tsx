import React from 'react';

export default function GuidePage() {
  return (
    <section className=" flex flex-col justify-center gap-5">
      <h1 className=" text-center text-4xl">Guide</h1>

      <h2 className=" font-bold text-xl">Connection:</h2>
      <ol
        style={{ listStyleType: 'decimal' }}
        className="-mt-3 flex flex-col gap-1 text-lg"
      >
        <li>
          By submitting username form You will be assigned to game server.
          Please, make sure You have status `connected`.
        </li>
      </ol>

      <h2 className=" font-bold text-xl">Gameplay:</h2>
      <ol
        style={{ listStyleType: 'decimal' }}
        className="-mt-3 flex flex-col gap-1 text-lg"
      >
        <li>
          Players choose who goes first (X or O) by flipping a coin, playing
          rock-paper-scissors, or however you decide.
        </li>
        <li>
          Players take turns marking an empty square in the grid with their
          chosen symbol (X or O).
        </li>
        <li>
          The objective is to be the first player to get three of your symbols
          in a row, either horizontally, vertically, or diagonally.
        </li>
        <li>
          Play continues until one player achieves a winning row, or all nine
          squares are filled (a tie).
        </li>
      </ol>

      <h2 className=" font-bold text-xl">Tips:</h2>
      <ul
        style={{ listStyleType: 'disc' }}
        className=" -mt-3 flex flex-col gap-1 text-lg"
      >
        <li>
          The first player has an advantage, so consider taking turns going
          first to keep things fair.
        </li>
        <li>
          {
            "Pay attention to your opponent's moves and try to block them from getting three in a row."
          }
        </li>
        <li>
          There are different strategies you can learn as you play more, but the
          basic concept is straightforward.
        </li>
      </ul>
    </section>
  );
}
