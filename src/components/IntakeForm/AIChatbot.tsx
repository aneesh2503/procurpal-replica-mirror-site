
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessagesSquare } from "lucide-react";
import { useForm } from 'react-hook-form';
import { type FormData } from './IntakeForm';

interface AIChatbotProps {
  form: ReturnType<typeof useForm<FormData>>;
}

const AIChatbot: React.FC<AIChatbotProps> = ({ form }) => {
  const handleAIAssist = () => {
    // For this demo, we'll auto-fill with sample data
    form.setValue('fullName', 'John Doe');
    form.setValue('email', 'john.doe@example.com');
    form.setValue('phone', '(123) 456-7890');
    form.setValue('dateOfBirth', new Date('1990-01-01'));
  };

  return (
    <div className="flex justify-end mb-4">
      <Button
        onClick={handleAIAssist}
        variant="outline"
        className="flex gap-2 items-center"
      >
        <MessagesSquare className="h-4 w-4" />
        Fill with AI
      </Button>
    </div>
  );
};

export default AIChatbot;
