
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessagesSquare } from "lucide-react";
import { useForm } from 'react-hook-form';
import { type FormData } from './IntakeForm';
import ChatDialog from './ChatDialog';

interface AIChatbotProps {
  form: ReturnType<typeof useForm<FormData>>;
}

const AIChatbot: React.FC<AIChatbotProps> = ({ form }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          className="flex gap-2 items-center border-custom-primary text-custom-primary hover:bg-custom-primary/10"
        >
          <MessagesSquare className="h-4 w-4 text-custom-primary" />
          Chat with AI
        </Button>
      </div>
      <ChatDialog 
        open={open}
        onOpenChange={setOpen}
        form={form}
      />
    </>
  );
};

export default AIChatbot;
