
import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type FormData } from './IntakeForm';
import { useForm } from 'react-hook-form';
import DocumentUploadDialog from './DocumentUploadDialog';
import { useChatMessages } from './hooks/useChatMessages';
import ChatBubble from './components/ChatBubble';
import ChatInput from './components/ChatInput';

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: ReturnType<typeof useForm<FormData>>;
}

const ChatDialog: React.FC<ChatDialogProps> = ({ open, onOpenChange, form }) => {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const { 
    messages, 
    handleDocumentProcess, 
    handleOptionSelect 
  } = useChatMessages(form, onOpenChange);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSubmit = (message: string) => {
    // This is now handled directly in the chat input component
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[800px] w-full max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-[#000034] text-xl">Chat with AI Assistant</DialogTitle>
            <DialogDescription>
              I'll help you fill out your intake form through conversation. Just choose your options or type your responses.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col h-[70vh]">
            <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
              <div className="space-y-4 p-1">
                {messages.map((message, index) => (
                  <ChatBubble 
                    key={`${message.id || index}-${message.content}`}
                    message={message} 
                    onOptionSelect={
                      message.field ? 
                        (option) => handleOptionSelect(option, message.field!) : 
                        undefined
                    }
                  />
                ))}
              </div>
            </ScrollArea>
            <ChatInput 
              onSubmit={handleSubmit}
              onUpload={() => setShowUploadDialog(true)}
              messages={messages}
            />
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
