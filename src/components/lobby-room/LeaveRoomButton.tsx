'use client';

import { socket, socketEvents } from '@/socket';

/* rtk */
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { roomSliceActions } from '@/store/slices/roomSlice';

/* components */
import PrimaryButton from '../common/PrimaryButton';
import { useEffect } from 'react';
import Link from 'next/link';

export default function LeaveRoomButton() {
  const dispatch = useAppDispatch();
  const { roomname } = useAppSelector((state) => state.roomSlice);

  /* leave room after leaving page */
  useEffect(() => {
    return () => {
      if (!roomname) return;
      socket.emit(
        socketEvents.LEAVE_ROOM,
        { roomname },
        (response: { status: number }) => {
          if (response.status === 200) {
            dispatch(roomSliceActions.setRoomName(''));
          }
        }
      );
    };
  }, [dispatch, roomname]);

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
