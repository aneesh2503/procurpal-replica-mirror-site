
import React from 'react';
import { type ChatBubbleProps } from '../types/chat';
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, onOptionSelect }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredOptions = message.options?.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasMultipleOptions = message.options && message.options.length > 1;
  const hasLargeOptionList = message.options && message.options.length > 8;

  return (
    <div
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-3`}
    >
      <div
        className={`rounded-lg px-4 py-3 max-w-[90%] ${
          message.role === 'user'
            ? 'bg-[#7E5DED] text-white'
            : 'bg-gray-100 text-[#000034]'
        }`}
      >
        <div className="mb-2">{message.content}</div>
        
        {hasMultipleOptions && hasLargeOptionList && (
          <div className="mt-3 mb-2">
            <Command className="rounded-lg border border-[#7E5DED]/30 shadow-sm">
              <CommandInput 
                placeholder="Search options..." 
                value={searchTerm}
                onValueChange={setSearchTerm}
                className="border-0"
              />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  <ScrollArea className="h-[200px]">
                    {(filteredOptions || []).map((option) => (
                      <CommandItem 
                        key={option.value}
                        value={option.value}
                        onSelect={() => onOptionSelect?.(option)}
                        className="cursor-pointer hover:bg-[#7E5DED]/10 py-2 px-2"
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
          <div className="mt-3 space-y-2">
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
