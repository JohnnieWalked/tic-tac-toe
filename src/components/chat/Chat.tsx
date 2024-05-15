'use client';

import { useState, useRef, useEffect, startTransition } from 'react';
import { socket, socketEvents } from '@/socket';
import { useToast } from '../ui/use-toast';

/* rtk */
import { useAppSelector, useAppDispatch } from '@/hooks/hooks';
import { roomSliceActions } from '@/store/slices/roomSlice';

/* helpers */
import { joinRoom } from '@/helpers/joinRoom';

/* components */
import { Input } from '../ui/input';
import PrimaryButton from '../common/PrimaryButton';
import ChatMessage from './ChatMessage';
import ChatMemberStatus from './ChatMemberStatus';

type ChatProps = {
  roomnameURLQuery: string;
  passwordURLQuery: string;
};

type ChatMessage = {
  username: string;
  userID: string;
  message: string;
  introduction?: boolean;
  abandon?: boolean;
};

export default function Chat({
  roomnameURLQuery,
  passwordURLQuery,
}: ChatProps) {
  const dispatch = useAppDispatch();
  const { username, allUsersArray } = useAppSelector(
    (state) => state.userSlice
  );
  const { roomname } = useAppSelector((state) => state.roomSlice);
  const { toast } = useToast();
  const [participators, setParticipators] =
    useState<{ username: string; userID: string }[]>();
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  /* scroll to new messsages in chat window */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  /* reconnect if user refreshed the page  */
  useEffect(() => {
    if (!roomname) {
      startTransition(async () => {
        const result = await joinRoom(roomnameURLQuery);
        if (result.success) {
          dispatch(roomSliceActions.setRoomName(roomnameURLQuery));
          toast({
            title: 'Success!',
            description: result.description,
          });
        }
      });
    }
  }, [dispatch, roomname, roomnameURLQuery, toast]);

  /* notify about joining user */
  useEffect(() => {
    socket.emit(socketEvents.CHAT_MESSAGE, {
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
    function roomParticipators(data: { username: string; userID: string }[]) {
      setParticipators(data);
    }

    socket.on(socketEvents.CHAT_MESSAGE, updateChat);
    socket.emit('users in room', { roomname });
    socket.on('users in room', roomParticipators);

    return () => {
      socket.off(socketEvents.CHAT_MESSAGE, updateChat);
      socket.off('users in room', roomParticipators);
    };
  }, [roomname]);

  function handleSubmit(formData: FormData) {
    const data = formData.get('chat-message') || '';

    /* avoid sending empty msg */
    if (!data.toString().trim()) return;

    /* send msg to the room; after response -> update chat history; */
    socket.emit(socketEvents.CHAT_MESSAGE, { message: data, roomname });
  }

  const renderedChatMembers = participators
    ?.sort((a, b) => {
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
