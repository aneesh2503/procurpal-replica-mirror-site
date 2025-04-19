
import React from 'react';
import { type ChatBubbleProps } from '../types/chat';

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  return (
    <div
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`rounded-lg px-4 py-2 max-w-[80%] ${
          message.role === 'user'
            ? 'bg-[#7E5DED] text-white'
            : 'bg-gray-100 text-[#000034]'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};

export default ChatBubble;
