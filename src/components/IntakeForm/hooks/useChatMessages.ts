
import { useState } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { type FormData } from '../IntakeForm';
import { isValid, parse } from 'date-fns';
import { type Message } from '../types/chat';

export const useChatMessages = (
  form: UseFormReturn<FormData>,
  onOpenChange: (open: boolean) => void
) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: "Hi! I'm here to help you fill out the intake form. You can either upload a document with your project details, or I can guide you through the form step by step. Would you like to upload a document?"
    }
  ]);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const handleDocumentProcess = (extractedText: string) => {
    addMessage({ role: 'user', content: 'I uploaded a document.' });
    addMessage({ 
      role: 'bot', 
      content: "I found the following information. I'll help you fill out the form with these details." 
    });

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

    addMessage({
      role: 'bot',
      content: "I've filled out some information from your document. Would you like to review and complete any remaining fields?"
    });
  };

  const processUserInput = (userMessage: string) => {
    addMessage({ role: 'user', content: userMessage });
    const lastBotMessage = messages[messages.length - 1].content.toLowerCase();
    
    if (lastBotMessage.includes('upload a document')) {
      handleUploadResponse(userMessage);
    } else if (lastBotMessage.includes('business unit')) {
      handleBusinessUnitResponse(userMessage);
    } else if (lastBotMessage.includes('region')) {
      handleRegionResponse(userMessage);
    } else if (lastBotMessage.includes('end user')) {
      handleEndUserResponse(userMessage);
    } else if (lastBotMessage.includes('priority')) {
      handlePriorityResponse(userMessage);
    } else if (lastBotMessage.includes('industry')) {
      handleIndustryResponse(userMessage);
    } else if (lastBotMessage.includes('category')) {
      handleCategoryResponse(userMessage);
    } else if (lastBotMessage.includes('cost center')) {
      handleCostCenterResponse(userMessage);
    } else if (lastBotMessage.includes('name of your project')) {
      handleProjectNameResponse(userMessage);
    } else if (lastBotMessage.includes('budget')) {
      handleBudgetResponse(userMessage);
    } else if (lastBotMessage.includes('currency')) {
      handleCurrencyResponse(userMessage);
    } else if (lastBotMessage.includes('due date')) {
      handleDueDateResponse(userMessage);
    } else if (lastBotMessage.includes('description of the project')) {
      handleProjectDescriptionResponse(userMessage);
    } else if (lastBotMessage.includes('name of the item')) {
      handleItemNameResponse(userMessage);
    } else if (lastBotMessage.includes('description for this item')) {
      handleItemDescriptionResponse(userMessage);
    } else if (lastBotMessage.includes('quantity')) {
      handleQuantityResponse(userMessage);
    } else if (lastBotMessage.includes('unit of measurement')) {
      handleUOMResponse(userMessage);
    } else if (lastBotMessage.includes('benchmark price')) {
      handleBenchmarkPriceResponse(userMessage);
      setTimeout(() => onOpenChange(false), 2000);
    }
  };

  const handleUploadResponse = (userMessage: string) => {
    if (userMessage.toLowerCase().includes('yes') || userMessage.toLowerCase().includes('upload')) {
      return true;
    } else {
      addMessage({
        role: 'bot',
        content: "Let's fill out the form together. First, which Business Unit are you from?"
      });
      return false;
    }
  };

  const handleBusinessUnitResponse = (userMessage: string) => {
    form.setValue('businessUnit', userMessage);
    addMessage({
      role: 'bot',
      content: "Thanks! Which region are you located in?"
    });
  };

  const handleRegionResponse = (userMessage: string) => {
    form.setValue('region', userMessage);
    addMessage({
      role: 'bot',
      content: "Who is the end user for this project?"
    });
  };

  const handleEndUserResponse = (userMessage: string) => {
    form.setValue('endUser', userMessage);
    addMessage({
      role: 'bot',
      content: "What priority level would you assign to this project?"
    });
  };

  const handlePriorityResponse = (userMessage: string) => {
    form.setValue('priority', userMessage);
    addMessage({
      role: 'bot',
      content: "Which industry does this project belong to?"
    });
  };

  const handleIndustryResponse = (userMessage: string) => {
    form.setValue('industry', userMessage);
    addMessage({
      role: 'bot',
      content: "What category does your project fall under?"
    });
  };

  const handleCategoryResponse = (userMessage: string) => {
    form.setValue('category', userMessage);
    addMessage({
      role: 'bot',
      content: "What's the cost center for this project?"
    });
  };

  const handleCostCenterResponse = (userMessage: string) => {
    form.setValue('costCenter', userMessage);
    addMessage({
      role: 'bot',
      content: "Great! Now, what's the name of your project?"
    });
  };

  const handleProjectNameResponse = (userMessage: string) => {
    form.setValue('projectName', userMessage);
    addMessage({
      role: 'bot',
      content: "What's the estimated budget for this project?"
    });
  };

  const handleBudgetResponse = (userMessage: string) => {
    form.setValue('projectBudget', userMessage);
    addMessage({
      role: 'bot',
      content: "What currency should be used for this project?"
    });
  };

  const handleCurrencyResponse = (userMessage: string) => {
    form.setValue('currency', userMessage);
    addMessage({
      role: 'bot',
      content: "What's the due date for this project? (YYYY-MM-DD format)"
    });
  };

  const handleDueDateResponse = (userMessage: string) => {
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
      addMessage({
        role: 'bot',
        content: "Could you provide a brief description of the project?"
      });
    } else {
      addMessage({
        role: 'bot',
        content: "I couldn't understand that date format. Please provide the due date in YYYY-MM-DD format (e.g., 2025-05-15)."
      });
    }
  };

  const handleProjectDescriptionResponse = (userMessage: string) => {
    form.setValue('projectDescription', userMessage);
    addMessage({
      role: 'bot',
      content: "Now let's add the first item. What's the name of the item?"
    });
  };

  const handleItemNameResponse = (userMessage: string) => {
    form.setValue('itemName', userMessage);
    addMessage({
      role: 'bot',
      content: "Please provide a description for this item."
    });
  };

  const handleItemDescriptionResponse = (userMessage: string) => {
    form.setValue('itemDescription', userMessage);
    addMessage({
      role: 'bot',
      content: "What quantity do you need?"
    });
  };

  const handleQuantityResponse = (userMessage: string) => {
    form.setValue('quantity', userMessage);
    addMessage({
      role: 'bot',
      content: "What's the unit of measurement (UOM)?"
    });
  };

  const handleUOMResponse = (userMessage: string) => {
    form.setValue('uom', userMessage);
    addMessage({
      role: 'bot',
      content: "Finally, what's the benchmark price for this item?"
    });
  };

  const handleBenchmarkPriceResponse = (userMessage: string) => {
    form.setValue('benchmarkPrice', userMessage);
    addMessage({
      role: 'bot',
      content: "Perfect! I've filled out all the information for your intake form. You can now review and submit the form."
    });
  };

  return {
    messages,
    handleDocumentProcess,
    processUserInput
  };
};
