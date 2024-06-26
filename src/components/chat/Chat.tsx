'use client';

import { useState, useRef, useEffect } from 'react';
import { socket, socketEvents } from '@/socket';

/* rtk */
import { useAppSelector, useAppDispatch } from '@/hooks/hooks';

/* components */
import { Input } from '../ui/input';
import PrimaryButton from '../common/PrimaryButton';
import ChatMessage from './ChatMessage';
import ChatMemberStatus from './ChatMemberStatus';

type ChatMessage = {
  username: string;
  userID: string;
  message?: string;
  introduction?: boolean;
  abandon?: boolean;
};

export default function Chat() {
  const { username, allUsersArray } = useAppSelector(
    (state) => state.userSlice
  );
  const { roomname, participators } = useAppSelector(
    (state) => state.roomSlice
  );
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  /* scroll to new messsages in chat window */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  /* notify about joining user */
  useEffect(() => {
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

    socket.on(socketEvents.CHAT_MESSAGE, updateChat);

    return () => {
      socket.off(socketEvents.CHAT_MESSAGE, updateChat);
    };
  }, [roomname]);

  function handleSubmit(formData: FormData) {
    const data = formData.get('chat-message') || '';

    /* avoid sending empty msg */
    if (!data.toString().trim()) return;

    /* send msg to the room; after response -> update chat history; */
    socket.emit(socketEvents.CHAT_MESSAGE, { message: data, roomname });
  }

  const renderedChatMembers = [...participators]
    .sort((a, b) => {
      /* reason for sorting -> display socket.username (yourself) on the right side. */
      if (a.userID === socket.userID) {
        return 1;
      }
      return -1;
    })
    .map((participator) => {
      return (
        <ChatMemberStatus
          key={participator.userID}
          username={participator.username}
          status={
            allUsersArray.find((user) => user.userID === participator.userID)
              ?.connected
          }
        />
      );
    });

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
          3) previous message was not the notification message from same socket (user joined / user left) -> introduction and abandon
          4) message is not 'user left'
          5) message is not 'user has joined'
        */
        chatMemberUsername={
          index !== 0 &&
          item.username === history[index - 1].username &&
          !item.introduction &&
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
      <div className=" flex justify-between items-center">
        {renderedChatMembers}
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
