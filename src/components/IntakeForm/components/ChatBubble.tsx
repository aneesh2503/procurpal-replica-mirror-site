
import React from 'react';
import { type ChatBubbleProps } from '../types/chat';
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, onOptionSelect }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredOptions = message.options?.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div>{message.content}</div>
        {message.options && message.options.length > 8 && (
          <div className="mt-2 relative">
            <Input
              placeholder="Search options..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 border-[#7E5DED]/30 focus-visible:ring-[#7E5DED]"
            />
            <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
          </div>
        )}
        {message.options && (
          <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
            {(filteredOptions || message.options).map((option) => (
              <Button
                key={option.value}
                onClick={() => onOptionSelect?.(option)}
                variant="outline"
                className="w-full justify-start text-left whitespace-normal h-auto py-2 border-[#7E5DED] text-[#7E5DED] hover:bg-[#7E5DED]/10"
              >
                {option.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
