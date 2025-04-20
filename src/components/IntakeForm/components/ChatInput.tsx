
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal, Upload } from "lucide-react";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  onUpload: () => void;
  messages: { 
    options?: { label: string, value: string }[];
    field?: string;
    id?: string;
  }[];
}

const ChatInput: React.FC<ChatInputProps> = ({ onSubmit, onUpload, messages }) => {
  const [input, setInput] = useState('');
  const latestMessage = messages[messages.length - 1];
  const hasOptions = latestMessage?.options && latestMessage.options.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input);
      setInput('');
    }
  };

  // Don't show input field if options are available
  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
      {!hasOptions && (
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border-[#7E5DED]/30 focus-visible:ring-[#7E5DED]"
        />
      )}
      
      {!hasOptions && (
        <Button 
          type="submit" 
          className="bg-[#7E5DED] hover:bg-[#7E5DED]/90 text-white"
        >
          <SendHorizontal className="h-4 w-4" />
        </Button>
      )}
      
      <Button
        type="button"
        variant="outline"
        className="border-[#7E5DED] text-[#7E5DED] hover:bg-[#7E5DED]/10"
        onClick={onUpload}
      >
        <Upload className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default ChatInput;
