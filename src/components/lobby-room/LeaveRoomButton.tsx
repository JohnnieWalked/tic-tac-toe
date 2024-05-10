'use client';

import { useRouter } from 'next/navigation';
import { socket } from '@/socket';

/* rtk */
import { useAppDispatch } from '@/hooks/hooks';
import { roomSliceActions } from '@/store/slices/roomSlice';

/* components */
import PrimaryButton from '../common/PrimaryButton';
import { useEffect } from 'react';

type LeaveRoomButtonProps = {
  roomname: string;
};

export default function LeaveRoomButton({ roomname }: LeaveRoomButtonProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  /* leave room after leaving page */
  useEffect(() => {
    return () => {
      socket.emit(
        'leave room',
        { roomname },
        (response: { status: number }) => {
          if (response.status === 200) {
            dispatch(roomSliceActions.setRoomName(''));
            router.push('/new-game/');
          }
        }
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PrimaryButton
      onClick={() => router.push('/new-game/')}
      variant="destructive"
      className=" mt-10 md:col-span-2"
    >
      Leave game
    </PrimaryButton>
  );
}
