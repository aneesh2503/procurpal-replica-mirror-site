
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
          className="flex gap-2 items-center border-[#7E5DED] text-[#7E5DED] hover:bg-[#7E5DED]/10"
        >
          <MessagesSquare className="h-4 w-4 text-[#7E5DED]" />
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
