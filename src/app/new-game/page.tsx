'use client';

import { useEffect, useState } from 'react';
import { socket } from '@/socket';

/* components */
import { columns } from '@/components/lobby-table/columns';
import { LobbyTable } from '@/components/lobby-table/LobbyTable';
import CreateRoomForm from '@/components/CreateNewGameForm';

/* types */
import type { Room } from '@/components/lobby-table/columns';

export default function NewGamePage() {
  const [lobbies, setLobbies] = useState<Room[]>([]);

  function updateOrCreateRoom(data: Room) {
    setLobbies((state) => {
      const findRoomIndexWithSameId = state.findIndex(
        (item) => item.id === data.id
      );
      if (findRoomIndexWithSameId !== -1) {
        const newState = [...state];
        newState[findRoomIndexWithSameId] = data;
        return newState;
      }
      return [data, ...state];
    });
  }

  /* add new created room to state or update if room with same id already exists  */
  useEffect(() => {
    socket.on('room event', (data: Room) => {
      console.log('New room was created:', data);
      updateOrCreateRoom(data);
    });
  }, []);

  return (
    <section className="flex flex-col gap-10">
      <div className="grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-10 place-items-center ">
        <CreateRoomForm />
        <LobbyTable columns={columns} data={lobbies} />
      </div>
    </section>
  );
}
