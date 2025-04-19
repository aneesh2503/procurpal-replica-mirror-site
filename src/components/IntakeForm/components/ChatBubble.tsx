
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
        {message.options && (
          <div className="mt-2 space-y-2">
            {message.options.map((option) => (
              <div 
                key={option.value} 
                className="text-sm text-gray-700"
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
