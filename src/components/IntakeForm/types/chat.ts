
export interface Option {
  label: string;
  value: string;
}

export interface Message {
  role: 'user' | 'bot';
  content: string;
  options?: Option[];
  field?: string;
}

export interface ChatBubbleProps {
  message: Message;
  onOptionSelect?: (option: Option) => void;
}
