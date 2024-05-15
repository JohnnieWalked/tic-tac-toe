'use client';

import { useEffect, useState } from 'react';
import { socket, socketEvents } from '@/socket';

/* components */
import { columns } from '@/components/lobby-table/columns';
import { LobbyTable } from '@/components/lobby-table/LobbyTable';
import CreateRoomForm from '@/components/CreateNewGameForm';
import Subheader from '@/components/common/Subheader';

/* types */
import type { Room } from '@/components/lobby-table/columns';

/* rtk */
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { UserInfo } from '@/store/slices/userSlice';

export default function NewGamePage() {
  const dispatch = useAppDispatch();
  const { allUsersArray } = useAppSelector((state) => state.userSlice);
  const [onlineUsers, setOnlineUsers] = useState<UserInfo[]>([]);
  const [lobbies, setLobbies] = useState<Room[]>([]);

  function updateOrCreateRoom(data: Room) {
    setLobbies((state) => {
      const findRoomIndexWithSameName = state.findIndex(
        (item) => item.roomname === data.roomname
      );
      if (findRoomIndexWithSameName !== -1) {
        const newState = [...state];
        if (data.amount === 0) {
          return newState.filter((item) => item.roomname !== data.roomname);
        }
        newState[findRoomIndexWithSameName] = {
          ...newState[findRoomIndexWithSameName],
          ...data,
        };
        return newState;
      }
      if (data.amount === 0) {
        return [...state];
      }
      return [data, ...state];
    });
  }

  /* add new created room to state or update if room with same id already exists  */
  useEffect(() => {
    socket.emit(socketEvents.ROOMS, (response: Room[]) => {
      setLobbies(response);
    });
    socket.on(socketEvents.ROOM_UPDATE, (data: Room) => {
      updateOrCreateRoom(data);
    });

    return () => {
      socket.off(socketEvents.ROOM_UPDATE);
    };
  }, [dispatch]);

  useEffect(() => {
    setOnlineUsers(allUsersArray.filter((user) => user.connected === true));
  }, [allUsersArray]);

  return (
    <section className="flex flex-col gap-10">
      <div className="grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-10 place-items-center ">
        <div className="flex flex-col items-center w-full gap-10">
          <Subheader props={{ className: 'flex gap-4' }}>
            Players online:{' '}
            <span className=" font-light text-cyan-400">
              {onlineUsers.length} / {allUsersArray.length}
            </span>
          </Subheader>
          <CreateRoomForm />
        </div>
        <LobbyTable columns={columns} data={lobbies} />
      </div>
    </section>
  );
}
