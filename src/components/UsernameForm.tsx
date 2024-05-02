'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useToast } from './ui/use-toast';
import axios, { AxiosError } from 'axios';
import { socket } from '@/socket';

/* rtk */
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { RootState } from '@/store';

/* components */
import PrimaryButton from './common/PrimaryButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { userSliceActions } from '@/store/slices/userSlice';

type UsernameFormProps = {
  error?: string;
};

export default function UsernameForm({ error }: UsernameFormProps) {
  const dispatch = useAppDispatch();
  const {
    isLoading,
    error: fetchUsernameError,
    username,
  } = useAppSelector((state: RootState) => state.userSlice);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  /* show error */
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error!',
        description: `${
          error.charAt(0).toUpperCase() + error.slice(1).replace(/-/g, ' ')
        }.`,
        variant: 'destructive',
      });
      router.replace(pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const handleSubmit = async (formData: FormData) => {
    socket.disconnect();
    await new Promise((r) => setTimeout(r, 2000));
    try {
      const response = await axios({
        method: 'post',
        url: '/api/form-username-submit',
        data: {
          username: formData.get('username')?.toString().trim(),
        },
      });

      if (response.status === 200) {
        dispatch(userSliceActions.setUsername(response.data));
        socket.auth = { username: response.data };
        socket.connect();
        toast({
          title: 'Success!',
          description:
            'Username was successfuly assigned. You have been connected to game server.',
        });
      }
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
  };

  return (
    <form action={(e) => handleSubmit(e)} className="flex flex-col gap-5">
      <div>
        <Label className=" pb-4 " htmlFor="username">
          Enter Your username
        </Label>
        <Input
          className=""
          id="username"
          name="username"
          placeholder="Your username"
          defaultValue={isLoading ? 'Loading...' : username}
          required
        />
      </div>
      <PrimaryButton variant={'outline'} className="">
        Submit
      </PrimaryButton>
    </form>
  );
}
