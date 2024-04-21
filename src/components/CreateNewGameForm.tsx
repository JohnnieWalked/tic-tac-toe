'use client';

import axios, { AxiosError } from 'axios';
import { useToast } from './ui/use-toast';
import { socket } from '@/socket';

/* components */
import PrimaryButton from './common/PrimaryButton';
import { Input } from './ui/input';
import { Label } from './ui/label';

export default function CreateRoomForm({
  isConnected,
}: {
  isConnected?: boolean;
}) {
  const { toast } = useToast();

  function handleSubmit(formData: FormData) {
    if (!isConnected) return;
    try {
      socket.emit('create-game', 'GOVNO', (response: string) => {
        console.log(response);
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: 'Something went wrong...',
          description: error.response?.data.errors.username,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Something went wrong...',
          variant: 'destructive',
        });
      }
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

      <PrimaryButton className="" variant="secondary">
        Create
      </PrimaryButton>
    </form>
  );
}
