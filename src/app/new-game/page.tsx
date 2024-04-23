'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { socket } from '../../socket';
import { SwitchTransition, CSSTransition } from 'react-transition-group';

/* rtk */
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { roomSliceActions } from '@/store/slices/roomSlice';
import { userSliceActions } from '@/store/slices/userSlice';

/* components */
import { columns } from '@/components/lobby-table/columns';
import { LobbyTable } from '@/components/lobby-table/LobbyTable';
import CreateRoomForm from '@/components/CreateNewGameForm';
import GameField from '@/components/GameField';
import Chat from '@/components/chat/Chat';

import type { Room } from '@/components/lobby-table/columns';

export default function NewGamePage() {
  const dispatch = useAppDispatch();
  const { username, isInGame } = useAppSelector((state) => state.userSlice);
  const [isConnected, setIsConnected] = useState<boolean>();
  const gameWrapperRef = useRef<HTMLDivElement | null>(null);
  const [transport, setTransport] = useState('N/A');
  const [lobbies, setLobbies] = useState<Room[]>([]);

  /* fetch username */
  useEffect(() => {
    axios('/api/get-username').then((response) =>
      dispatch(userSliceActions.setUsername(response.data.username))
    );
  }, [dispatch]);

  /* socket */
  useEffect(() => {
    if (socket.connected) onConnect();
    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);
      socket.io.engine.on('upgrade', (transport) => {
        setTransport(transport.name);
      });
    }
    function onDisconnect() {
      setIsConnected(false);
      setTransport('N/A');
    }
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    socket.on('new-room', (data: Room) => {
      console.log(data);
      setLobbies((state) => [data, ...state]);
    });

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return (
    <section className="flex flex-col gap-10">
      <div className="flex justify-between items-center text-lg">
        <h2 className="">
          Username: <b className=" uppercase">{username}</b>
        </h2>
        <div>
          Status:{' '}
          <span
            className={` font-light ${
              isConnected ? 'text-green-600' : 'text-red-700'
            }`}
          >
            {isConnected ? 'connected' : 'disconnected'}
          </span>
        </div>
      </div>
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={isInGame}
          addEndListener={(done) => {
            gameWrapperRef.current?.addEventListener(
              'transitionend',
              done,
              false
            );
          }}
          nodeRef={gameWrapperRef}
          classNames="fade"
        >
          <div
            ref={gameWrapperRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-10 place-items-center "
          >
            {isInGame === 'in game' ? (
              <>
                <div className="w-max overflow-hidden">
                  <GameField
                    animateGameplay={false}
                    disableClickSquare={false}
                  />
                </div>
                <Chat />
              </>
            ) : (
              <>
                <CreateRoomForm isConnected={isConnected} />
                <LobbyTable columns={columns} data={lobbies} />
              </>
            )}
          </div>
        </CSSTransition>
      </SwitchTransition>
    </section>
  );
}
