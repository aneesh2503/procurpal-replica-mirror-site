
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, ClipboardList } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

// Import our components
import { Message, IntakeFormData, IntakeFormState } from "./chatbot/types";
import { ChatMessageList } from "./chatbot/ChatMessageList";
import { ChatInput } from "./chatbot/ChatInput";
import { MobileChatDialog } from "./chatbot/MobileChatDialog";
import { DesktopChatDialog } from "./chatbot/DesktopChatDialog";
import { processUserMessage } from "./chatbot/chatService";
import { IntakeForm } from "./chatbot/IntakeForm";

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
  
  // Intake form state
  const [formState, setFormState] = useState<IntakeFormState>({
    isVisible: false,
    data: {
      name: "",
      email: "",
      company: "",
      role: "",
      requirements: "",
      priority: "medium"
    },
    currentStep: 1,
    totalSteps: 3
  });

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Update conversation context whenever messages change
  useEffect(() => {
    if (messages.length <= 1) return; // Skip if only welcome message
    
    // Build context from the most recent messages
    const recentMessages = messages.slice(-5); // Last 5 messages
    const contextSummary = recentMessages
      .map(msg => `${msg.isBot ? 'Bot' : 'User'}: ${msg.content}`)
      .join('\n');
    
    setConversationContext(contextSummary);
  }, [messages]);

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

    // Check if this message is about filling a form
    const lowerMsg = inputMessage.toLowerCase();
    if (
      lowerMsg.includes("form") || 
      lowerMsg.includes("fill out") || 
      lowerMsg.includes("request") || 
      lowerMsg.includes("intake")
    ) {
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: "Would you like to fill out a procurement request form?",
          isBot: true,
          timestamp: new Date(),
          intent: "form",
        };
        
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 1000);
      return;
    }

    // Add a small delay to simulate processing time
    setTimeout(() => {
      try {
        // Pass recent messages for context-aware responses
        const botResponse = processUserMessage(userMessage.content, messages);

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

  // Clear chat history and context
  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome-new",
        content: "Chat history cleared. How can I assist you with procurement today?",
        isBot: true,
        timestamp: new Date(),
      },
    ]);
    setConversationContext("");
    setFormState(prev => ({...prev, isVisible: false}));
  };

  // Handle showing the form
  const handleShowForm = () => {
    setFormState(prev => ({...prev, isVisible: true}));
    
    // Add system message that form is now visible
    const formMessage: Message = {
      id: `form-${Date.now()}`,
      content: "Please fill out the procurement request form below:",
      isBot: true,
      timestamp: new Date(),
      intent: "form",
    };
    
    setMessages(prev => [...prev, formMessage]);
  };

  // Handle form submission
  const handleFormSubmit = (data: IntakeFormData) => {
    // Hide the form
    setFormState(prev => ({...prev, isVisible: false, data}));
    
    // Add confirmation message
    const confirmMessage: Message = {
      id: `form-submit-${Date.now()}`,
      content: `Thank you ${data.name}! Your procurement request has been submitted with ${data.priority} priority. We'll review your requirements and get back to you at ${data.email} soon.`,
      isBot: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, confirmMessage]);
    
    // Show toast notification
    toast({
      title: "Form Submitted",
      description: "Your procurement request has been received.",
    });
  };

  // Handle form cancellation
  const handleFormCancel = () => {
    setFormState(prev => ({...prev, isVisible: false}));
    
    // Add cancellation message
    const cancelMessage: Message = {
      id: `form-cancel-${Date.now()}`,
      content: "Form cancelled. How else can I assist you with procurement today?",
      isBot: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, cancelMessage]);
  };

  // Respond to "yes" when asked about the form
  useEffect(() => {
    if (messages.length < 2) return;
    
    const lastBotMsg = messages.filter(m => m.isBot).pop();
    const lastUserMsg = messages.filter(m => !m.isBot).pop();
    
    if (
      lastBotMsg?.intent === "form" && 
      lastBotMsg?.content.includes("Would you like to fill out") &&
      lastUserMsg && 
      ["yes", "sure", "okay", "ok", "yep", "yeah"].some(word => 
        lastUserMsg.content.toLowerCase().includes(word)
      )
    ) {
      handleShowForm();
    }
  }, [messages]);

  const ChatbotContent = () => (
    <>
      <div className="flex justify-between items-center px-4 py-2 border-b border-gray-100">
        <h3 className="text-sm font-medium">ProcurPal AI Assistant</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleShowForm}
            className="text-xs h-7"
          >
            <ClipboardList className="w-3 h-3 mr-1" />
            New Request
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearChat}
            className="text-xs h-7"
          >
            Clear Chat
          </Button>
        </div>
      </div>
      <ChatMessageList messages={messages} isTyping={isTyping} />
      
      {formState.isVisible ? (
        <div className="px-4 py-2">
          <IntakeForm 
            onSubmit={handleFormSubmit} 
            onCancel={handleFormCancel} 
          />
        </div>
      ) : (
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
                onClick={() => handleSuggestionClick("Fill out a procurement request form")}
                className="text-xs"
              >
                Fill out request form
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
      )}
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
