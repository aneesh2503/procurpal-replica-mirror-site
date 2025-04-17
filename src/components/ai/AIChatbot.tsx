
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

// Import our new components
import { Message } from "./chatbot/types";
import { ChatMessageList } from "./chatbot/ChatMessageList";
import { ChatInput } from "./chatbot/ChatInput";
import { MobileChatDialog } from "./chatbot/MobileChatDialog";
import { DesktopChatDialog } from "./chatbot/DesktopChatDialog";
import { processUserMessage } from "./chatbot/chatService";

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm ProcurPal AI. How can I assist you with procurement today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = processUserMessage(userMessage.content);

      const newBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newBotMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const ChatbotContent = () => (
    <>
      <ChatMessageList messages={messages} isTyping={isTyping} />
      <ChatInput
        ref={inputRef}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        handleSendMessage={handleSendMessage}
        handleKeyDown={handleKeyDown}
        isTyping={isTyping}
      />
    </>
  );

  return (
    <>
      {isMobile ? (
        <MobileChatDialog isOpen={isOpen} setIsOpen={setIsOpen}>
          <ChatbotContent />
        </MobileChatDialog>
      ) : (
        <DesktopChatDialog isOpen={isOpen} setIsOpen={setIsOpen}>
          <ChatbotContent />
        </DesktopChatDialog>
      )}
      
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 shadow-lg rounded-full h-14 w-14 p-0 flex items-center justify-center bg-procurpal-primary hover:bg-procurpal-primary/90 text-white"
        aria-label="Open chatbot"
      >
        <MessageSquare size={24} />
      </Button>
    </>
  );
}
