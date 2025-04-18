
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";
import { type FormData } from './IntakeForm';
import { useForm } from 'react-hook-form';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: ReturnType<typeof useForm<FormData>>;
}

const ChatDialog: React.FC<ChatDialogProps> = ({ open, onOpenChange, form }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: "Hi! I'm here to help you fill out the intake form. Let's start with your full name. What should I call you?"
    }
  ]);
  const [input, setInput] = useState('');

  const processUserInput = (userMessage: string) => {
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    // Simple logic to process responses and fill form
    const lastBotMessage = messages[messages.length - 1].content.toLowerCase();
    
    if (lastBotMessage.includes('full name')) {
      form.setValue('fullName', userMessage);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: `Thanks! What's your email address?`
      }]);
    } else if (lastBotMessage.includes('email')) {
      form.setValue('email', userMessage);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: `Great! And your phone number?`
      }]);
    } else if (lastBotMessage.includes('phone')) {
      form.setValue('phone', userMessage);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: `Thanks! And finally, what's your date of birth? (YYYY-MM-DD format)`
      }]);
    } else if (lastBotMessage.includes('date of birth')) {
      try {
        const date = new Date(userMessage);
        form.setValue('dateOfBirth', date);
        setMessages(prev => [...prev, {
          role: 'bot',
          content: `Perfect! I've filled out all your information. You can review and submit the form now.`
        }]);
        setTimeout(() => onOpenChange(false), 2000);
      } catch (e) {
        setMessages(prev => [...prev, {
          role: 'bot',
          content: `Please provide the date in YYYY-MM-DD format.`
        }]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      processUserInput(input);
      setInput('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-custom-text">Chat with AI Assistant</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-[400px]">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.role === 'user'
                        ? 'bg-custom-primary text-white'
                        : 'bg-gray-100 text-custom-text'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" className="bg-custom-primary hover:bg-custom-primary/90">
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;
