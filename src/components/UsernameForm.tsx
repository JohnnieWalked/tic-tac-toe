'use client';

import { useEffect, useState } from 'react';
import { useToast } from './ui/use-toast';
import axios, { AxiosError } from 'axios';

/* components */
import PrimaryButton from './common/PrimaryButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function UsernameForm() {
  const { toast } = useToast();
  const [username, setUsername] = useState<string>();

  useEffect(() => {
    if (localStorage.getItem('username') !== username) {
      setUsername(localStorage.getItem('username') || '');
    }
  }, [username]);

  const handleSubmit = async (formData: FormData) => {
    try {
      const response = await axios({
        method: 'post',
        url: '/api/form-username-submit',
        data: {
          username: formData.get('username'),
        },
      });
      console.log(response);

      if (response.status === 200) {
        localStorage.setItem('username', response.data);
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
