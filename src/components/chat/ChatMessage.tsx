'use client';

import { motion } from 'framer-motion';
import './ChatMessage.css';

type ChatMessageProps = {
  introduction?: boolean;
  abandon?: boolean;
  isHostMessage: boolean;
  chatMemberUsername: string;
  message?: string;
  className?: string;
};

export default function ChatMessage({
  isHostMessage,
  chatMemberUsername,
  message,
  introduction,
  abandon,
  className,
}: ChatMessageProps) {
  const typeMessage = () => {
    if (introduction || abandon) {
      return 'flex bg-secondary backdrop-blur-xl  w-max px-3 py-2 m-1 rounded-xl self-center';
    } else {
      return `flex bg-secondary max-w-[70%] flex-col first-of-type:mt-4 my-1 mx-2 px-4 py-2 rounded-2xl border ${
        isHostMessage ? 'self-end chat_msg--right' : 'chat_msg--left self-start'
      }`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: 'easeInOut', duration: 0.3 }}
      className={typeMessage()}
    >
      <h4 className={'text-xs font-bold '}>
        {chatMemberUsername} {introduction && 'has joined'}{' '}
        {abandon && 'has left'}
      </h4>
      <p>{message}</p>
    </motion.div>
  );
}
