
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
      { role: 'bot', content: "I found the following information. I'll help you fill out the form with these details." }
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
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    const lastBotMessage = messages[messages.length - 1].content.toLowerCase();
    
    if (lastBotMessage.includes('upload a document')) {
      if (userMessage.toLowerCase().includes('yes') || userMessage.toLowerCase().includes('upload')) {
        setShowUploadDialog(true);
      } else {
        setMessages(prev => [...prev, {
          role: 'bot',
          content: "Let's fill out the form together. First, which Business Unit are you from?"
        }]);
      }
    } else if (lastBotMessage.includes('business unit')) {
      form.setValue('businessUnit', userMessage);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: "Thanks! Which region are you located in?"
      }]);
    } else if (lastBotMessage.includes('region')) {
      form.setValue('region', userMessage);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: "Who is the end user for this project?"
      }]);
    } else if (lastBotMessage.includes('end user')) {
      form.setValue('endUser', userMessage);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: "What priority level would you assign to this project?"
      }]);
    } else if (lastBotMessage.includes('priority')) {
      form.setValue('priority', userMessage);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: "Which industry does this project belong to?"
      }]);
    } else if (lastBotMessage.includes('industry')) {
      form.setValue('industry', userMessage);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: "What category does your project fall under?"
      }]);
    } else if (lastBotMessage.includes('category')) {
      form.setValue('category', userMessage);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: "What's the cost center for this project?"
      }]);
    } else if (lastBotMessage.includes('cost center')) {
      form.setValue('costCenter', userMessage);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: "Great! Now, what's the name of your project?"
      }]);
    } else if (lastBotMessage.includes('name of your project')) {
      form.setValue('projectName', userMessage);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: "What's the estimated budget for this project?"
      }]);
    } else if (lastBotMessage.includes('budget')) {
      form.setValue('projectBudget', userMessage);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: "What currency should be used for this project?"
      }]);
    } else if (lastBotMessage.includes('currency')) {
      form.setValue('currency', userMessage);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: "What's the due date for this project? (YYYY-MM-DD format)"
      }]);
    } else if (lastBotMessage.includes('due date')) {
      const formats = ['yyyy-MM-dd', 'MM/dd/yyyy', 'dd/MM/yyyy'];
      let validDate = null;
      
      const directDate = new Date(userMessage);
      if (isValid(directDate) && directDate.toString() !== 'Invalid Date') {
        validDate = directDate;
      } else {
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
          content: "Could you provide a brief description of the project?"
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'bot',
          content: "I couldn't understand that date format. Please provide the due date in YYYY-MM-DD format (e.g., 2025-05-15)."
        }]);
      }
    } else if (lastBotMessage.includes('description of the project')) {
      form.setValue('projectDescription', userMessage);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: "Now let's add the first item. What's the name of the item?"
      }]);
    } else if (lastBotMessage.includes("name of the item")) {
      form.setValue('itemName', userMessage);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: "Please provide a description for this item."
      }]);
    } else if (lastBotMessage.includes("description for this item")) {
      form.setValue('itemDescription', userMessage);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: "What quantity do you need?"
      }]);
    } else if (lastBotMessage.includes("quantity")) {
      form.setValue('quantity', userMessage);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: "What's the unit of measurement (UOM)?"
      }]);
    } else if (lastBotMessage.includes("unit of measurement")) {
      form.setValue('uom', userMessage);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: "Finally, what's the benchmark price for this item?"
      }]);
    } else if (lastBotMessage.includes("benchmark price")) {
      form.setValue('benchmarkPrice', userMessage);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: "Perfect! I've filled out all the information for your intake form. You can now review and submit the form. Would you like to add another item?"
      }]);
      setTimeout(() => onOpenChange(false), 2000);
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
