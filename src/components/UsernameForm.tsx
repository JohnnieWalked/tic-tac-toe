'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from './ui/use-toast';
import axios, { AxiosError } from 'axios';

/* components */
import PrimaryButton from './common/PrimaryButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type UsernameFormProps = {
  error?: string;
};

export default function UsernameForm({ error }: UsernameFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [username, setUsername] = useState<string>();

  /* put username into input from cookies if user has entered username before  */
  useEffect(() => {
    axios('/api/get-username').then((response) =>
      setUsername(response.data.username)
    );
  }, []);

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
    try {
      const response = await axios({
        method: 'post',
        url: '/api/form-username-submit',
        data: {
          username: formData.get('username')?.toString().trim(),
        },
      });
      console.log(response);

      if (response.status === 200) {
        toast({
          title: 'Success!',
          description: 'Username was successfuly assigned.',
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
        console.log(error);
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
          defaultValue={username}
          required
        />
      </div>
      <PrimaryButton variant={'outline'} className="">
        Submit
      </PrimaryButton>
    </form>
  );
}
