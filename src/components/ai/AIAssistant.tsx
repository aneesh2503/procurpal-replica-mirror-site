
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Send, Sparkles } from "lucide-react";

interface AIAssistantProps {
  onAIQuery: (query: string) => void;
}

export function AIAssistant({ onAIQuery }: AIAssistantProps) {
  const [query, setQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestions, setSuggestions] = useState([
    "Show me products with low stock",
    "Analyze product pricing trends",
    "Recommend products to reorder",
    "Find slow-moving inventory"
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsProcessing(true);
    onAIQuery(query);
    
    // Simulate AI processing time
    setTimeout(() => {
      setQuery("");
      setIsProcessing(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onAIQuery(suggestion);
    setIsProcessing(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      setQuery("");
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-procurpal-primary/10 text-procurpal-primary rounded-full p-1">
          <Sparkles size={18} />
        </div>
        <h3 className="font-medium text-gray-800">AI Procurement Assistant</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            placeholder="Ask about your inventory, suggest reorders, analyze trends..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isProcessing}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={isProcessing || !query.trim()}
          >
            {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
          </Button>
        </div>
      </form>
      
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => handleSuggestionClick(suggestion)}
            disabled={isProcessing}
            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
