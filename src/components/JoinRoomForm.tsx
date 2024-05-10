import React from 'react';
import { useToast } from './ui/use-toast';
import { joinRoom } from '@/helpers/joinRoom';
import { useAppDispatch } from '@/hooks/hooks';
import { roomSliceActions } from '@/store/slices/roomSlice';
import { useRouter } from 'next/navigation';

type JoinRoomProps = {
  inputNameAttr: string;
  children?: React.ReactNode;
  className?: string;
};

export default function JoinRoomForm({
  children,
  className,
  inputNameAttr,
}: JoinRoomProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handleJoin = async (data: FormData) => {
    const roomname = data.get(inputNameAttr) || '';

    const result = await joinRoom(roomname);
    if (result.success) {
      dispatch(roomSliceActions.setRoomName(roomname.toString()));
      toast({
        title: 'Success!',
        description: result.description,
      });
      return router.push(`/new-game/game-room?roomname=${roomname}`);
    }

    toast({
      title: 'Something went wrong...',
      description: result.description,
      variant: 'destructive',
    });
    return;
  };

  return (
    <form className={`${className}`} action={handleJoin}>
      {children}
    </form>
  );
}
