'use client';

import { useState, useRef, useEffect } from 'react';
import { socket } from '@/socket';

/* rtk */
import { useAppSelector } from '@/hooks/hooks';

/* components */
import { Input } from '../ui/input';
import PrimaryButton from '../common/PrimaryButton';
import ChatMessage from './ChatMessage';
import ChatMemberStatus from './ChatMemberStatus';

type ChatMessage = {
  username: string;
  userID: string;
  message: string;
  introduction?: boolean;
  abandon?: boolean;
};

export default function Chat() {
  const { username, allUsersArray } = useAppSelector(
    (state) => state.userSlice
  );
  const [guest, setGuest] = useState<{ username: string; userID: string }>();
  const { roomname } = useAppSelector((state) => state.roomSlice);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  /* scroll to new messsages in chat window */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  /* notify about joining user */
  useEffect(() => {
    socket.emit('chat message', {
      roomname,
      introduction: true,
    });

    function updateChat(data: ChatMessage) {
      setHistory((state) => [
        ...state,
        {
          username: data.username,
          userID: data.userID,
          message: data.message,
          introduction: data.introduction,
          abandon: data.abandon,
        },
      ]);
    }

    /* set info about opponent */
    function updateGuest(data: { username: string; userID: string }[]) {
      const secondUser = data.find((user) => user.userID !== socket.userID);
      setGuest(secondUser);
    }

    socket.on('chat message', updateChat);
    socket.emit('room users', { roomname });
    socket.on('room users', updateGuest);

    return () => {
      socket.off('chat message', updateChat);
      socket.off('room users', updateGuest);
    };
  }, [roomname]);

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
        introduction={item.introduction}
        abandon={item.abandon}
        isHostMessage={username === item.username}
        /* 
          avoid passing username if:
          1) message before was from the same user
          2) message is not the first in chat
          3) previous message was not the notification message (user joined / user left)
          4) message is not 'user left'
        */
        chatMemberUsername={
          index !== 0 &&
          item.username === history[index - 1].username &&
          !history[index - 1].introduction &&
          !item.abandon &&
          !history[index - 1].abandon
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
      <div className=" flex justify-between items-center">
        <ChatMemberStatus
          username={guest?.username || 'Waiting for opponent...'}
          status={
            allUsersArray.find((user) => user.userID === guest?.userID)
              ?.connected
          }
        />
        <ChatMemberStatus
          username={socket.username}
          status={socket.connected}
        />
      </div>
      <div className="flex w-full flex-col h-96 overflow-y-auto border rounded-xl">
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
