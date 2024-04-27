'use client';

import { useState, useRef, useEffect } from 'react';
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
  const chatEndRef = useRef<HTMLDivElement>(null);

  /* scroll to new messsages in chat window */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    socket.on('chat message', (data: { username: string; message: string }) => {
      setHistory((state) => [
        ...state,
        { username: data.username, message: data.message },
      ]);
    });
  }, []);

  function handleSubmit(formData: FormData) {
    const data = formData.get('chat-message') || '';

    /* avoid sending empty msg */
    if (!data.toString().trim()) return;

    /* send msg to another user in the room; after response -> update chat history; */
    socket.emit('chat message', { message: data, roomname });
  }

  const renderedMessages = history.map((item, index) => {
    return (
      <ChatMessage
        key={index}
        isHostMessage={username === item.username}
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
    <section className="flex flex-col w-full gap-3">
      <h3 className=" text-center text-xl">Chat</h3>
      <div className="flex flex-col h-96 overflow-y-auto border rounded-xl">
        {renderedMessages}
        <div ref={chatEndRef} />
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
