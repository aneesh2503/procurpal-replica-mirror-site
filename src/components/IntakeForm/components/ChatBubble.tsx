
import React, { useState } from 'react';
import { type ChatBubbleProps } from '../types/chat';
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, onOptionSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = message.options?.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasMultipleOptions = message.options && message.options.length > 1;
  const hasLargeOptionList = message.options && message.options.length > 8;

  return (
    <div
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`rounded-lg px-4 py-3 max-w-[85%] ${
          message.role === 'user'
            ? 'bg-[#7E5DED] text-white'
            : 'bg-gray-100 text-[#000034]'
        }`}
      >
        <div className="mb-2 text-lg">{message.content}</div>
        
        {hasMultipleOptions && hasLargeOptionList && (
          <div className="mt-4 mb-2">
            <Command className="rounded-lg border border-[#7E5DED]/30 shadow-sm bg-white">
              <CommandInput 
                placeholder="Search options..." 
                value={searchTerm}
                onValueChange={setSearchTerm}
                className="border-0"
              />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  <ScrollArea className="h-[300px]">
                    {(filteredOptions || []).map((option) => (
                      <CommandItem 
                        key={option.value}
                        value={option.value}
                        onSelect={() => {
                          onOptionSelect?.(option);
                          setSearchTerm('');
                        }}
                        className="cursor-pointer hover:bg-[#7E5DED]/10 py-3 px-2"
                      >
                        {option.label}
                      </CommandItem>
                    ))}
                  </ScrollArea>
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        )}
        
        {hasMultipleOptions && !hasLargeOptionList && (
          <div className="mt-4 space-y-2">
            {(filteredOptions || message.options).map((option) => (
              <Button
                key={option.value}
                onClick={() => onOptionSelect?.(option)}
                variant="outline"
                className="w-full justify-start text-left whitespace-normal h-auto py-3 border-[#7E5DED] text-[#7E5DED] hover:bg-[#7E5DED]/10"
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
