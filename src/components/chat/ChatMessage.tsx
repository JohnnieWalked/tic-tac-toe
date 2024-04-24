'use client';

import { motion } from 'framer-motion';
import './ChatMessage.css';

type ChatMessageProps = {
  isHostMessage: boolean;
  chatMemberUsername: string;
  message: string;
  className?: string;
};

export default function ChatMessage({
  isHostMessage,
  chatMemberUsername,
  message,
  className,
}: ChatMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: 'easeInOut', duration: 0.3 }}
      className={`flex bg-secondary flex-col first-of-type:mt-4 my-1 mx-2 px-4 py-2 rounded-2xl border ${
        isHostMessage ? 'self-end chat_msg--right' : 'chat_msg--left'
      }`}
    >
      <h4 className={'text-xs font-bold'}>{chatMemberUsername}</h4>
      <p>{message}</p>
    </motion.div>
  );
}
