import React, { useState } from 'react';
import { type ChatBubbleProps } from '../types/chat';
import { Button } from "@/components/ui/button";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, onOptionSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [date, setDate] = useState<Date>();

  const filteredOptions = message.options?.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasMultipleOptions = message.options && message.options.length > 1;
  const hasLargeOptionList = message.options && message.options.length > 8;
  const isDateField = message.field === 'dueDate';

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      onOptionSelect?.({ 
        label: format(selectedDate, "PPP"), 
        value: selectedDate.toISOString() 
      });
    }
  };

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
        
        {isDateField && (
          <div className="mt-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-[#7E5DED]",
                    !date && "text-muted-foreground"
                  )}
                >
                  {date ? (
                    format(date, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50 text-[#7E5DED]" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
        
        {hasMultipleOptions && hasLargeOptionList && !isDateField && (
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
        
        {hasMultipleOptions && !hasLargeOptionList && !isDateField && (
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
        
        {message.options && message.options.length === 1 && !isDateField && (
          <div className="mt-4">
            <Button
              onClick={() => onOptionSelect?.(message.options![0])}
              variant="outline"
              className="w-full justify-start text-left whitespace-normal h-auto py-3 border-[#7E5DED] text-[#7E5DED] hover:bg-[#7E5DED]/10"
            >
              {message.options[0].label}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
