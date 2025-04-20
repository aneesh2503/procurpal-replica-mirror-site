
export interface Option {
  label: string;
  value: string;
}

export interface Message {
  role: 'user' | 'bot';
  content: string;
  options?: Option[];
  field?: string;
  id?: string; // Unique ID to prevent duplicate messages
}

export interface ChatBubbleProps {
  message: Message;
  onOptionSelect?: (option: Option) => void;
}

export type FormField = 
  | 'businessUnit' 
  | 'region' 
  | 'endUser' 
  | 'priority' 
  | 'industry' 
  | 'category' 
  | 'costCenter'
  | 'projectName'
  | 'projectBudget'
  | 'dueDate'
  | 'currency'
  | 'projectDescription'
  | 'itemName'
  | 'itemDescription'
  | 'quantity'
  | 'uom'
  | 'benchmarkPrice';
