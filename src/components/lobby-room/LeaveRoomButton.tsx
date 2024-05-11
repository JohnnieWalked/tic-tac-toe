'use client';

import { socket } from '@/socket';

/* rtk */
import { useAppDispatch } from '@/hooks/hooks';
import { roomSliceActions } from '@/store/slices/roomSlice';

/* components */
import PrimaryButton from '../common/PrimaryButton';
import { useEffect } from 'react';
import Link from 'next/link';

type LeaveRoomButtonProps = {
  roomname: string;
};

export default function LeaveRoomButton({ roomname }: LeaveRoomButtonProps) {
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
          }
        }
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PrimaryButton
      asChild
      variant="destructive"
      className=" mt-10 md:col-span-2"
    >
      <Link href={'/new-game/'}>Leave game</Link>
    </PrimaryButton>
  );
}
