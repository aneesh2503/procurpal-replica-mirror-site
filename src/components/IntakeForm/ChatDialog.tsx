import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal, Upload } from "lucide-react";
import { type FormData } from './IntakeForm';
import { useForm } from 'react-hook-form';
import { isValid, parse } from 'date-fns';
import DocumentUploadDialog from './DocumentUploadDialog';

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
      content: "Hi! I'm here to help you fill out the intake form. You can either upload a document with your project details, or I can guide you through the form step by step. Would you like to upload a document?"
    }
  ]);
  const [input, setInput] = useState('');
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const handleDocumentProcess = (extractedText: string) => {
    setMessages(prev => [...prev, 
      { role: 'user', content: 'I uploaded a document.' },
      { role: 'bot', content: 'I found the following information. I'll help you fill out the form with these details.' }
    ]);

    // Parse the extracted text and set form values
    const lines = extractedText.split('\n');
    lines.forEach(line => {
      const [key, value] = line.split(': ');
      switch(key) {
        case 'Business Unit':
          form.setValue('businessUnit', value);
          break;
        case 'Category':
          form.setValue('category', value);
          break;
        case 'Project Name':
          form.setValue('projectName', value);
          break;
        case 'Project Budget':
          form.setValue('projectBudget', value);
          break;
        case 'Due Date':
          const date = new Date(value);
          if (isValid(date)) {
            form.setValue('dueDate', date);
          }
          break;
      }
    });

    setMessages(prev => [...prev, {
      role: 'bot',
      content: "I've filled out some information from your document. Would you like to review and complete any remaining fields?"
    }]);
  };

  const processUserInput = (userMessage: string) => {
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    const lastBotMessage = messages[messages.length - 1].content.toLowerCase();
    
    if (lastBotMessage.includes('upload a document')) {
      if (userMessage.toLowerCase().includes('yes') || userMessage.toLowerCase().includes('upload')) {
        setShowUploadDialog(true);
      } else {
        setMessages(prev => [...prev, {
          role: 'bot',
          content: "Alright, let's fill out the form together. Which Business Unit are you from?"
        }]);
      }
    } else if (lastBotMessage.includes('business unit')) {
      // Simple logic to process responses and fill form
      const lastBotMessage = messages[messages.length - 1].content.toLowerCase();
      
      if (lastBotMessage.includes('business unit')) {
        form.setValue('businessUnit', userMessage);
        setMessages(prev => [...prev, {
          role: 'bot',
          content: `Thanks! What category does your project fall under?`
        }]);
      } else if (lastBotMessage.includes('category')) {
        form.setValue('category', userMessage);
        setMessages(prev => [...prev, {
          role: 'bot',
          content: `Great! What's the name of your project?`
        }]);
      } else if (lastBotMessage.includes('project name')) {
        form.setValue('projectName', userMessage);
        setMessages(prev => [...prev, {
          role: 'bot',
          content: `Thanks! And what's your estimated project budget?`
        }]);
      } else if (lastBotMessage.includes('budget')) {
        form.setValue('projectBudget', userMessage);
        setMessages(prev => [...prev, {
          role: 'bot',
          content: `What's the due date for this project? (YYYY-MM-DD format)`
        }]);
      } else if (lastBotMessage.includes('due date')) {
        // Improved date parsing
        // Try different date formats
        const formats = ['yyyy-MM-dd', 'MM/dd/yyyy', 'dd/MM/yyyy'];
        let validDate = null;
        
        // First try direct Date construction
        const directDate = new Date(userMessage);
        if (isValid(directDate) && directDate.toString() !== 'Invalid Date') {
          validDate = directDate;
        } else {
          // Try parsing with different formats
          for (const format of formats) {
            const parsedDate = parse(userMessage, format, new Date());
            if (isValid(parsedDate)) {
              validDate = parsedDate;
              break;
            }
          }
        }
        
        if (validDate) {
          form.setValue('dueDate', validDate);
          setMessages(prev => [...prev, {
            role: 'bot',
            content: `Perfect! Lastly, what's the name of the first item you need for this project?`
          }]);
        } else {
          setMessages(prev => [...prev, {
            role: 'bot',
            content: `I couldn't understand that date format. Please provide the due date in YYYY-MM-DD format (e.g., 2025-05-15).`
          }]);
        }
      } else if (lastBotMessage.includes('item')) {
        form.setValue('itemName', userMessage);
        setMessages(prev => [...prev, {
          role: 'bot',
          content: `Thank you! I've filled out the main information for your intake form. You can now review and complete any remaining fields before submitting.`
        }]);
        setTimeout(() => onOpenChange(false), 2000);
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
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-[#000034]">Chat with AI Assistant</DialogTitle>
            <DialogDescription>
              I'll help you fill out your intake form through conversation.
            </DialogDescription>
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
                          ? 'bg-[#7E5DED] text-white'
                          : 'bg-gray-100 text-[#000034]'
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
                onClick={() => setShowUploadDialog(true)}
              >
                <Upload className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
      <DocumentUploadDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        onDocumentProcess={handleDocumentProcess}
      />
    </>
  );
};

export default ChatDialog;
