'use client';

import { useState, useRef } from 'react';
import { socket } from '@/socket';

/* rtk */
import { useAppSelector } from '@/hooks/hooks';

/* components */
import { Input } from '../ui/input';
import PrimaryButton from '../common/PrimaryButton';
import ChatMessage from './ChatMessage';

type ChatMessage = {
  username: string;
  message: string;
};

export default function Chat() {
  const { username } = useAppSelector((state) => state.userSlice);
  const { roomname } = useAppSelector((state) => state.roomSlice);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    const data = formData.get('chat-message') || '';

    socket.emit(
      'chat message',
      { username, message: data, roomname },
      (response: { status: number } & ChatMessage) => {
        if (response.status === 200) {
          setHistory((state) => [
            ...state,
            { username: response.username, message: response.message },
          ]);
        }
      }
    );
  }

  const renderedMessages = history.map((item, index) => {
    return (
      <ChatMessage
        key={index}
        hostUsername={username}
        chatMemberUsername={
          index !== 0 && item.username === history[index - 1].username
            ? ''
            : item.username
        }
        message={item.message}
      />
    );
  });

  return (
    <section className="flex flex-col w-full">
      <h3 className=" text-center text-xl">Chat</h3>
      <div className="flex flex-col h-96 overflow-y-auto">
        {renderedMessages}
      </div>
      <form
        ref={formRef}
        className="flex justify-between gap-5"
        action={(formData) => {
          handleSubmit(formData);
          formRef.current?.reset();
        }}
      >
        <Input
          id="chat-message"
          name="chat-message"
          placeholder="Type message here..."
        />
        <PrimaryButton variant={'secondary'}>Send message</PrimaryButton>
      </form>
    </section>
  );
}
