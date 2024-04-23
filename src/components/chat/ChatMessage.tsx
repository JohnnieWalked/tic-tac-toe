import React from 'react';

type ChatMessageProps = {
  hostUsername: string;
  chatMemberUsername: string;
  message: string;
};

export default function ChatMessage({
  hostUsername,
  chatMemberUsername,
  message,
}: ChatMessageProps) {
  return (
    <div className="flex flex-col gap-1">
      <h4>{chatMemberUsername}</h4>
      <p>{message}</p>
    </div>
  );
}
