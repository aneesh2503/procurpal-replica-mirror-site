import { useState } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { type FormData } from '../IntakeForm';
import { isValid } from 'date-fns';
import { type Message, type Option } from '../types/chat';
import {
  BUSINESS_UNITS,
  PRIORITY_LEVELS,
  INDUSTRIES,
  CATEGORIES,
  CURRENCIES,
  UNITS_OF_MEASUREMENT
} from '../constants/formOptions';

export const useChatMessages = (
  form: UseFormReturn<FormData>,
  onOpenChange: (open: boolean) => void
) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: "Hi! I can help you fill out the intake form in two ways:",
      options: [
        { label: 'Upload a document with project details', value: 'upload' },
        { label: 'Guide me through the form step by step', value: 'manual' }
      ],
      id: 'initial'
    }
  ]);

  const addMessage = (message: Message) => {
    const messageWithId = {
      ...message,
      id: message.id || `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    };
    setMessages(prev => [...prev, messageWithId]);
  };

  const formatOptionsFromArray = (arr: string[]): Option[] => {
    return arr.map(item => ({ label: item, value: item }));
  };

  const handleFieldOptions = (field: string) => {
    switch (field) {
      case 'businessUnit':
        return formatOptionsFromArray(BUSINESS_UNITS);
      case 'priority':
        return formatOptionsFromArray(PRIORITY_LEVELS);
      case 'industry':
        return formatOptionsFromArray(INDUSTRIES);
      case 'category':
        return formatOptionsFromArray(CATEGORIES);
      case 'currency':
        return CURRENCIES;
      case 'uom':
        return UNITS_OF_MEASUREMENT;
      default:
        return [];
    }
  };

  const processUserOption = (selectedOption: string) => {
    addMessage({ role: 'user', content: selectedOption });

    if (selectedOption.toLowerCase().includes('upload')) {
      addMessage({ 
        role: 'bot', 
        content: "Great! Let's upload a document with your project details. Click the upload button below." 
      });
    } else {
      addMessage({
        role: 'bot',
        content: "Let's start with your Business Unit. Which one do you belong to?",
        options: handleFieldOptions('businessUnit'),
        field: 'businessUnit'
      });
    }
  };

  const handleOptionSelect = (option: Option, field: string) => {
    if (field === 'dueDate') {
      const date = new Date(option.value);
      form.setValue(field as keyof FormData, date);
    } else {
      form.setValue(field as keyof FormData, option.value);
    }
    
    addMessage({ role: 'user', content: option.label });

    // Progress to next field based on current field
    switch (field) {
      case 'businessUnit':
        addMessage({
          role: 'bot',
          content: 'What priority level would you assign to this project?',
          options: handleFieldOptions('priority'),
          field: 'priority'
        });
        break;
      case 'priority':
        addMessage({
          role: 'bot',
          content: 'Which industry does this project belong to?',
          options: handleFieldOptions('industry'),
          field: 'industry'
        });
        break;
      case 'industry':
        addMessage({
          role: 'bot',
          content: 'What category best describes your project?',
          options: handleFieldOptions('category'),
          field: 'category'
        });
        break;
      case 'category':
        addMessage({
          role: 'bot',
          content: 'Please select the currency for this project:',
          options: handleFieldOptions('currency'),
          field: 'currency'
        });
        break;
      case 'currency':
        addMessage({
          role: 'bot',
          content: "When do you need this project completed? Please select a due date.",
          field: 'dueDate'
        });
        break;
      case 'dueDate':
        addMessage({
          role: 'bot',
          content: "Great! Could you provide a brief description of the project requirements?",
          field: 'projectDescription'
        });
        break;
      case 'projectDescription':
        addMessage({
          role: 'bot',
          content: "Now let's add the first item. What's the name of the item?"
        });
        break;
      case 'itemName':
        addMessage({
          role: 'bot',
          content: "Please provide a description for this item."
        });
        break;
      case 'itemDescription':
        addMessage({
          role: 'bot',
          content: "What quantity do you need?"
        });
        break;
      case 'quantity':
        addMessage({
          role: 'bot',
          content: "What's the unit of measurement (UOM)?",
          options: handleFieldOptions('uom'),
          field: 'uom'
        });
        break;
      case 'uom':
        addMessage({
          role: 'bot',
          content: "Finally, what's the benchmark price for this item?"
        });
        break;
      case 'benchmarkPrice':
        addMessage({
          role: 'bot',
          content: "Perfect! I've filled out all the information for your intake form. You can now review and submit the form."
        });
        setTimeout(() => onOpenChange(false), 2000);
        break;
      default:
        // Handle text inputs
        const nextField = getNextField(field);
        if (nextField) {
          addMessage({
            role: 'bot',
            content: getPromptForField(nextField),
            options: handleFieldOptions(nextField),
            field: nextField
          });
        }
        break;
    }
  };

  const getNextField = (currentField: string): string => {
    const fieldSequence: string[] = [
      'businessUnit', 'priority', 'industry', 'category', 'currency', 'dueDate',
      'projectDescription', 'itemName', 'itemDescription', 'quantity', 'uom', 'benchmarkPrice'
    ];
    
    const currentIndex = fieldSequence.indexOf(currentField);
    if (currentIndex >= 0 && currentIndex < fieldSequence.length - 1) {
      return fieldSequence[currentIndex + 1];
    }
    return '';
  };

  const getPromptForField = (field: string): string => {
    switch (field) {
      case 'businessUnit':
        return "Which business unit do you belong to?";
      case 'priority':
        return "What priority level would you assign to this project?";
      case 'industry':
        return "Which industry does this project belong to?";
      case 'category':
        return "What category best describes your project?";
      case 'currency':
        return "Please select the currency for this project:";
      case 'dueDate':
        return "What's the due date for this project? (YYYY-MM-DD format)";
      case 'projectDescription':
        return "Could you provide a brief description of the project?";
      case 'itemName':
        return "What's the name of the item?";
      case 'itemDescription':
        return "Please provide a description for this item.";
      case 'quantity':
        return "What quantity do you need?";
      case 'uom':
        return "What's the unit of measurement (UOM)?";
      case 'benchmarkPrice':
        return "What's the benchmark price for this item?";
      default:
        return "Please provide more information:";
    }
  };

  const handleDocumentProcess = (extractedText: string) => {
    addMessage({ role: 'user', content: 'I uploaded a document.' });
    addMessage({ 
      role: 'bot', 
      content: "I found the following information. I'll help you fill out the form with these details." 
    });

    const lines = extractedText.split('\n');
    let fieldsProcessed = false;
    
    lines.forEach(line => {
      const [key, value] = line.split(': ');
      if (key && value) {
        fieldsProcessed = true;
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
      }
    });

    if (fieldsProcessed) {
      addMessage({
        role: 'bot',
        content: "I've filled out some information from your document. Would you like to review and complete any remaining fields?",
        options: [
          { label: 'Yes, let me review what was filled', value: 'review' },
          { label: 'Yes, let me complete the remaining fields', value: 'complete' }
        ]
      });
    } else {
      addMessage({
        role: 'bot',
        content: "I couldn't extract any structured data from the document. Would you like me to guide you through filling the form manually?",
        options: [
          { label: 'Yes, guide me through the form', value: 'manual' }
        ]
      });
    }
  };

  const processUserInput = (userMessage: string) => {
    addMessage({ role: 'user', content: userMessage });
    
    const lastBotMessageWithField = [...messages].reverse().find(
      m => m.role === 'bot' && m.field
    );
    
    if (lastBotMessageWithField && lastBotMessageWithField.field) {
      if (lastBotMessageWithField.field === 'dueDate') {
        try {
          const date = new Date(userMessage);
          if (isValid(date)) {
            form.setValue('dueDate', date);
            handleOptionSelect({ label: userMessage, value: userMessage }, 'dueDate');
          } else {
            addMessage({
              role: 'bot',
              content: "I couldn't understand that date format. Please provide a date in YYYY-MM-DD format.",
            });
          }
        } catch (e) {
          addMessage({
            role: 'bot',
            content: "Please provide a valid date in YYYY-MM-DD format.",
          });
        }
      } else {
        form.setValue(lastBotMessageWithField.field as keyof FormData, userMessage);
        handleOptionSelect({ label: userMessage, value: userMessage }, lastBotMessageWithField.field);
      }
    } else {
      addMessage({
        role: 'bot',
        content: "I'm here to help you fill out the intake form. Do you want me to guide you through it step by step?",
        options: [
          { label: 'Yes, guide me through the form', value: 'manual' }
        ]
      });
    }
  };

  return {
    messages,
    handleDocumentProcess,
    processUserInput,
    processUserOption,
    handleOptionSelect
  };
};
