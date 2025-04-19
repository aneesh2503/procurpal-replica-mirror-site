
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal, Upload } from "lucide-react";
import { Check, RadioIcon } from "lucide-react";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  onUpload: () => void;
  messages: { options?: { label: string, value: string }[] }[];
}

const ChatInput: React.FC<ChatInputProps> = ({ onSubmit, onUpload, messages }) => {
  const [input, setInput] = useState('');
  const latestMessage = messages[messages.length - 1];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input);
      setInput('');
    }
  };

  // Render options if available
  if (latestMessage?.options) {
    return (
      <div className="space-y-2">
        {latestMessage.options.map((option) => (
          <Button 
            key={option.value}
            onClick={() => onSubmit(option.label)}
            variant="outline"
            className="w-full justify-start gap-2 border-[#7E5DED] text-[#7E5DED] hover:bg-[#7E5DED]/10"
          >
            <RadioIcon className="h-4 w-4" />
            {option.label}
          </Button>
        ))}
      </div>
    );
  }

  // Standard input form
  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 border-[#7E5DED]/30 focus-visible:ring-[#7E5DED]"
      />
      <Button 
        type="submit" 
        className="bg-[#7E5DED] hover:bg-[#7E5DED]/90 text-white"
      >
        <SendHorizontal className="h-4 w-4" />
      </Button>
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
