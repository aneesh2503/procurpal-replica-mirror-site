
import React, { useState } from 'react';
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
  const { 
    messages, 
    handleDocumentProcess, 
    processUserOption,
    handleOptionSelect 
  } = useChatMessages(form, onOpenChange);

  const handleSubmit = (message: string) => {
    const latestMessage = messages[messages.length - 1];
    if (latestMessage.options) {
      processUserOption(message);
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
                  <ChatBubble 
                    key={index} 
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
