import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Bot, 
  X, 
  Send, 
  Maximize2, 
  Minimize2,
  MessageSquare,
  Sparkles
} from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

type Message = {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
};

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      const botResponses: { [key: string]: string } = {
        help: "I can help you with procurement tasks like finding suppliers, analyzing inventory, recommending reorder quantities, and more. Just tell me what you need assistance with!",
        inventory: "Your current inventory status shows 5 items with low stock. Would you like me to prepare a reorder plan?",
        supplier: "I can help you find reliable suppliers or analyze your current supplier performance. What specific information are you looking for?",
        report: "I can generate procurement reports based on your data. Would you like a summary report, cost analysis, or supplier performance report?",
      };

      const lowerCaseInput = inputMessage.toLowerCase();
      let botResponse = "I'm not sure how to help with that specific request. Could you try asking something about inventory, suppliers, procurement, or reports?";

      Object.keys(botResponses).forEach((key) => {
        if (lowerCaseInput.includes(key)) {
          botResponse = botResponses[key];
        }
      });

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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const ChatbotContent = () => (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
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
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-lg p-3 max-w-[80%]">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <Textarea
            ref={inputRef}
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[60px] resize-none"
            rows={1}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="shrink-0"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {isMobile ? (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <Button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-5 right-5 shadow-lg rounded-full h-14 w-14 p-0 flex items-center justify-center bg-procurpal-primary hover:bg-procurpal-primary/90 text-white"
            aria-label="Open chatbot"
          >
            <MessageSquare size={24} />
          </Button>
          <DrawerContent className="h-[85%]">
            <DrawerHeader className="border-b pb-2">
              <div className="flex items-center">
                <div className="p-1 rounded-full bg-procurpal-primary/10 text-procurpal-primary mr-2">
                  <Sparkles size={18} />
                </div>
                <DrawerTitle>ProcurPal AI Assistant</DrawerTitle>
              </div>
            </DrawerHeader>
            <div className="flex flex-col h-[calc(100%-64px)]">
              {ChatbotContent()}
            </div>
            <DrawerFooter className="pt-2 border-t">
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <Button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-5 right-5 shadow-lg rounded-full h-14 w-14 p-0 flex items-center justify-center bg-procurpal-primary hover:bg-procurpal-primary/90 text-white"
            aria-label="Open chatbot"
          >
            <MessageSquare size={24} />
          </Button>
          <DialogContent className="w-[400px] h-[600px] flex flex-col p-0 gap-0">
            <DialogHeader className="py-3 px-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-full bg-procurpal-primary/10 text-procurpal-primary">
                    <Sparkles size={18} />
                  </div>
                  <DialogTitle>ProcurPal AI Assistant</DialogTitle>
                </div>
              </div>
            </DialogHeader>
            <div className="flex flex-col flex-1 overflow-hidden">
              {ChatbotContent()}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
