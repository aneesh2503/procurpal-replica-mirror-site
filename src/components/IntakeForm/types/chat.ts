
export interface Message {
  role: 'user' | 'bot';
  content: string;
  options?: { label: string; value: string }[];
}

export interface ChatBubbleProps {
  message: Message;
}
