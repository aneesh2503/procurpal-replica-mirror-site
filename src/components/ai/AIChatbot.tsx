
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

// Import our components
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
  const [conversationContext, setConversationContext] = useState<string>("");

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
      context: conversationContext,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Update conversation context based on recent messages
    const recentMessages = [...messages.slice(-3), userMessage]
      .map(msg => msg.content)
      .join(" | ");
    setConversationContext(recentMessages);

    // Add a small delay to simulate processing time
    setTimeout(() => {
      try {
        const botResponse = processUserMessage(userMessage.content);

        const newBotMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: botResponse,
          isBot: true,
          timestamp: new Date(),
          context: conversationContext,
        };

        setMessages((prev) => [...prev, newBotMessage]);
      } catch (error) {
        console.error("Error processing message:", error);
        toast({
          title: "Error",
          description: "Sorry, I encountered an error processing your request.",
          variant: "destructive",
        });
        
        // Add fallback message
        const fallbackMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "I apologize, but I'm having trouble processing your request right now. Could you try rephrasing or ask something else?",
          isBot: true,
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, fallbackMessage]);
      } finally {
        setIsTyping(false);
      }
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle suggestions or quick replies
  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const ChatbotContent = () => (
    <>
      <ChatMessageList messages={messages} isTyping={isTyping} />
      <div className="px-4 py-2 border-t border-gray-100">
        {messages.length === 1 && (
          <div className="mb-3 flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleSuggestionClick("Show me items with low stock")}
              className="text-xs"
            >
              Show me items with low stock
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleSuggestionClick("Help me find a reliable supplier for electronics")}
              className="text-xs"
            >
              Find electronics suppliers
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleSuggestionClick("Generate a procurement report")}
              className="text-xs"
            >
              Generate procurement report
            </Button>
          </div>
        )}
        <ChatInput
          ref={inputRef}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
          handleKeyDown={handleKeyDown}
          isTyping={isTyping}
        />
      </div>
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
