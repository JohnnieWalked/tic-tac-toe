'use client';

import { useToast } from './ui/use-toast';
import { socket } from '@/socket';
import { CreateGameSchema } from '@/schemas';

/* rtk */
import { useAppDispatch } from '@/hooks/hooks';
import { userSliceActions } from '@/store/slices/userSlice';
import { roomSliceActions } from '@/store/slices/roomSlice';

/* components */
import PrimaryButton from './common/PrimaryButton';
import { Input } from './ui/input';
import { Label } from './ui/label';

export default function CreateRoomForm({
  isConnected,
}: {
  isConnected?: boolean;
}) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  function handleSubmit(formData: FormData) {
    if (!isConnected) return;
    const result = CreateGameSchema.safeParse({
      roomname: formData.get('roomname'),
      password: formData.get('password'),
    });

    if (!result.success) {
      toast({
        title: 'Room name error!',
        description: result.error.flatten().fieldErrors.roomname,
        variant: 'destructive',
      });
      return;
    }

    try {
      socket.emit(
        'create-game',
        { roomname: result.data.roomname, password: result.data.password },
        (response: string) => {
          /* after creating a game -> automatically throw user into game-room (lobby) */
          if (response === 'success') {
            dispatch(userSliceActions.updateIsInGameStatus(true));
            dispatch(roomSliceActions.setRoomName(result.data.roomname));
            dispatch(roomSliceActions.setPassword(result.data.password));
          }
        }
      );
    } catch (error) {
      toast({
        title: 'Something went wrong...',
        variant: 'destructive',
      });
      console.error(error);
    }
  }

  return (
    <form className="flex flex-col gap-4" action={(e) => handleSubmit(e)}>
      <h3 className=" text-xl text-center font-bold">Create New Game</h3>
      <div>
        <Label>Room name:</Label>
        <Input
          className=""
          id="roomname"
          name="roomname"
          placeholder="Room name"
          required
        />
      </div>
      <div>
        <Label>Password:</Label>
        <Input
          className=""
          id="password"
          name="password"
          placeholder="Leave empty to enable free access."
        />
      </div>

      <PrimaryButton variant={'secondary'} className="">
        Create
      </PrimaryButton>
    </form>
  );
}
