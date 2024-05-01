'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { socket } from '../../socket';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { useToast } from '@/components/ui/use-toast';

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
import PrimaryButton from '@/components/common/PrimaryButton';

import type { Room } from '@/components/lobby-table/columns';

export default function NewGamePage() {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { username, isInGame } = useAppSelector((state) => state.userSlice);
  const { roomname } = useAppSelector((state) => state.roomSlice);
  const [isConnected, setIsConnected] = useState<boolean>();
  const gameWrapperRef = useRef<HTMLDivElement | null>(null);
  const [transport, setTransport] = useState('N/A');
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

  function leaveRoom() {
    if (!roomname) {
      toast({
        title: 'Cannot leave the game!',
        description: 'There is no active game detected.',
        variant: 'destructive',
      });
      return;
    }
    socket.emit('leave room', { roomname }, (response: { status: number }) => {
      if (response.status === 200) {
        dispatch(roomSliceActions.setRoomName(''));
        // dispatch(roomSliceActions.setPassword(''));
        dispatch(userSliceActions.updateIsInGameStatus('not in game'));
      }
    });
  }

  useEffect(() => {
    /* add new created room to state or update if room with same id already exists  */
    socket.on('room event', (data: Room) => {
      console.log('New room was created:', data);
      updateOrCreateRoom(data);
    });
  }, []);

  return (
    <section className="flex flex-col gap-10">
      <div className="flex justify-between items-center text-lg">
        <h2 className="">
          Username: <b className=" uppercase">{username}</b>
        </h2>
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
            className="grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-10 place-items-center "
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
                <PrimaryButton
                  onClick={leaveRoom}
                  variant="destructive"
                  className=" mt-10 md:col-span-2"
                >
                  Leave game
                </PrimaryButton>
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
