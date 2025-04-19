
export interface Message {
  role: 'user' | 'bot';
  content: string;
}

export interface ChatBubbleProps {
  message: Message;
}
