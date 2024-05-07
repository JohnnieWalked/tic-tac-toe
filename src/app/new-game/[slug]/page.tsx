'use client';

import { useToast } from '@/components/ui/use-toast';
import { useEffect } from 'react';
import { socket } from '@/socket';

/* rtk */
import { useAppSelector, useAppDispatch } from '@/hooks/hooks';
import { userSliceActions } from '@/store/slices/userSlice';
import { roomSliceActions } from '@/store/slices/roomSlice';

/* components */
import PrimaryButton from '@/components/common/PrimaryButton';
import GameField from '@/components/GameField';
import Chat from '@/components/chat/Chat';
import { useRouter } from 'next/navigation';

export default function GameRoom() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { roomname } = useAppSelector((state) => state.roomSlice);

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
        dispatch(userSliceActions.updateIsInGameStatus('not in game'));
        router.push('/new-game/');
      }
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-10 place-items-center">
      <div className="w-max overflow-hidden">
        <GameField animateGameplay={false} disableClickSquare={false} />
      </div>
      <Chat />
      <PrimaryButton
        onClick={leaveRoom}
        variant="destructive"
        className=" mt-10 md:col-span-2"
      >
        Leave game
      </PrimaryButton>
    </div>
  );
}
