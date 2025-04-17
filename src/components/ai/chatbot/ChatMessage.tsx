
import { Bot } from "lucide-react";
import { Message } from "./types";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className={`flex ${
        message.isBot ? "justify-start" : "justify-end"
      }`}
    >
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          message.isBot
            ? "bg-gray-100 text-gray-800"
            : "bg-procurpal-primary text-white"
        }`}
      >
        {message.isBot && (
          <div className="flex items-center gap-2 mb-1">
            <Bot size={16} />
            <span className="text-xs font-semibold">ProcurPal AI</span>
          </div>
        )}
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <div
          className={`text-xs mt-1 text-right ${
            message.isBot ? "text-gray-500" : "text-gray-100"
          }`}
        >
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
}
