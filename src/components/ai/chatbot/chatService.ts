
import { Intent, NLPResult, Entity, Message, ConversationContext } from "./types";

// Sample database of procurement-related information
const productDatabase = {
  "office chair": { stock: 45, supplier: "Office Comfort Solutions", price: 12500 },
  "macbook": { stock: 12, supplier: "Tech Solutions Ltd.", price: 225000 },
  "printer": { stock: 8, supplier: "Office Supplies Co.", price: 85000 },
  "paper": { stock: 120, supplier: "Global Supplies", price: 2500 },
  "desk": { stock: 15, supplier: "Metro Furniture", price: 9500 },
};

const supplierDatabase = {
  "office comfort solutions": { rating: 4.8, deliveryTime: "3-5 days", category: "Furniture" },
  "tech solutions ltd.": { rating: 4.5, deliveryTime: "1-2 days", category: "Electronics" },
  "office supplies co.": { rating: 4.2, deliveryTime: "2-3 days", category: "Electronics" },
  "global supplies": { rating: 4.0, deliveryTime: "1-2 days", category: "Stationery" },
  "metro furniture": { rating: 4.6, deliveryTime: "5-7 days", category: "Furniture" },
};

// NLP processing functions
function detectIntent(message: string): Intent {
  const lowerCaseMsg = message.toLowerCase();
  
  if (lowerCaseMsg.includes("help") || lowerCaseMsg.includes("assist")) return "help";
  if (lowerCaseMsg.includes("inventory") || lowerCaseMsg.includes("stock")) return "inventory";
  if (lowerCaseMsg.includes("supplier") || lowerCaseMsg.includes("vendor")) return "supplier";
  if (lowerCaseMsg.includes("report") || lowerCaseMsg.includes("analytics")) return "report";
  if (lowerCaseMsg.includes("price") || lowerCaseMsg.includes("cost")) return "pricing";
  if (lowerCaseMsg.includes("order") || lowerCaseMsg.includes("purchase")) return "order";
  
  return "unknown";
}

function extractEntities(message: string): Entity[] {
  const entities: Entity[] = [];
  const lowerCaseMsg = message.toLowerCase();
  
  // Extract product entities
  for (const product of Object.keys(productDatabase)) {
    if (lowerCaseMsg.includes(product)) {
      entities.push({
        type: "product",
        value: product,
        confidence: 0.9,
      });
    }
  }
  
  // Extract supplier entities
  for (const supplier of Object.keys(supplierDatabase)) {
    if (lowerCaseMsg.includes(supplier)) {
      entities.push({
        type: "supplier",
        value: supplier,
        confidence: 0.9,
      });
    }
  }
  
  // Extract quantity entities
  const quantityRegex = /(\d+)\s+(units|items|pieces)/i;
  const quantityMatch = message.match(quantityRegex);
  if (quantityMatch) {
    entities.push({
      type: "quantity",
      value: quantityMatch[1],
      confidence: 0.85,
    });
  }
  
  return entities;
}

function analyzeSentiment(message: string): 'positive' | 'neutral' | 'negative' {
  const lowerCaseMsg = message.toLowerCase();
  
  const positiveWords = ["good", "great", "excellent", "wonderful", "pleased", "happy", "like", "best"];
  const negativeWords = ["bad", "terrible", "poor", "worst", "dislike", "disappointed", "issue", "problem"];
  
  let positiveScore = 0;
  let negativeScore = 0;
  
  for (const word of positiveWords) {
    if (lowerCaseMsg.includes(word)) positiveScore++;
  }
  
  for (const word of negativeWords) {
    if (lowerCaseMsg.includes(word)) negativeScore++;
  }
  
  if (positiveScore > negativeScore) return "positive";
  if (negativeScore > positiveScore) return "negative";
  return "neutral";
}

// Process the message and generate NLP results
function processNLP(message: string, context?: string): NLPResult {
  const intent = detectIntent(message);
  const entities = extractEntities(message);
  const sentiment = analyzeSentiment(message);
  
  // Use context to improve NLP results if available
  if (context) {
    // Extract additional entities from context that might be relevant
    const contextEntities = extractEntities(context);
    
    // Add context entities that aren't already in the current message entities
    for (const contextEntity of contextEntities) {
      if (!entities.some(e => e.type === contextEntity.type && e.value === contextEntity.value)) {
        entities.push({
          ...contextEntity,
          confidence: contextEntity.confidence * 0.8, // Slightly lower confidence for context entities
        });
      }
    }
  }
  
  return {
    intent,
    confidence: entities.length > 0 ? 0.85 : 0.7,
    entities,
    sentiment,
  };
}

// Create a context summary from recent messages
function buildContextSummary(messages: Message[]): string {
  if (messages.length === 0) return "";
  
  // Extract the most recent user intent if available
  const lastUserMessageWithIntent = [...messages]
    .reverse()
    .find(m => !m.isBot && m.intent);
  
  // Extract all unique entities mentioned
  const mentionedEntities = new Set<string>();
  messages.forEach(msg => {
    const msgEntities = extractEntities(msg.content);
    msgEntities.forEach(entity => {
      mentionedEntities.add(`${entity.type}:${entity.value}`);
    });
  });
  
  // Build context summary
  let summary = "";
  
  if (lastUserMessageWithIntent?.intent) {
    summary += `Intent: ${lastUserMessageWithIntent.intent}. `;
  }
  
  if (mentionedEntities.size > 0) {
    summary += "Mentioned: ";
    summary += Array.from(mentionedEntities).map(e => {
      const [type, value] = e.split(':');
      return `${value} (${type})`;
    }).join(', ');
  }
  
  return summary;
}

// Generate contextual responses based on NLP results
function generateResponse(nlpResult: NLPResult, message: string, recentMessages: Message[] = []): string {
  const { intent, entities, sentiment } = nlpResult;
  
  // Check for follow-up questions
  const isFollowUp = recentMessages.length > 0 && 
    !message.endsWith("?") && 
    message.length < 20;
  
  // If it seems like a follow-up to previous conversation
  if (isFollowUp && recentMessages.length > 0) {
    const previousBotMessage = [...recentMessages]
      .reverse()
      .find(m => m.isBot);
    
    if (previousBotMessage) {
      // Handle follow-up based on previous bot message and current message
      if (previousBotMessage.content.includes("Would you like") && 
         (message.toLowerCase().includes("yes") || message.toLowerCase().includes("sure"))) {
        if (previousBotMessage.content.includes("inventory")) {
          return "I've prepared a detailed inventory report. There are 5 items with critically low stock levels that need attention. Would you like me to create a reorder plan for these items?";
        } else if (previousBotMessage.content.includes("supplier")) {
          return "Based on your requirements, here are the top 3 recommended suppliers: Tech Solutions Ltd. (Electronics), Office Comfort Solutions (Furniture), and Global Supplies (General). Would you like more details about any of these suppliers?";
        } else if (previousBotMessage.content.includes("order")) {
          return "Great! I've initiated the order process. The estimated delivery date is April 24, 2025. Would you like to receive email notifications about this order?";
        }
      }
    }
  }
  
  // Handle different intents with context awareness
  switch (intent) {
    case "help":
      return "I can help you with procurement tasks like finding suppliers, analyzing inventory, managing orders, checking product pricing, and generating reports. What would you like assistance with today?";
      
    case "inventory":
      if (entities.length > 0) {
        const productEntities = entities.filter(e => e.type === "product");
        if (productEntities.length > 0) {
          const product = productEntities[0].value;
          const productInfo = productDatabase[product];
          return `We currently have ${productInfo.stock} units of ${product} in stock. The supplier is ${productInfo.supplier} and it's priced at ₹${productInfo.price}. Would you like to place an order?`;
        }
      }
      return "Your current inventory status shows 5 items with low stock. Would you like to see a detailed inventory report or prepare a reorder plan?";
      
    case "supplier":
      if (entities.length > 0) {
        const supplierEntities = entities.filter(e => e.type === "supplier");
        if (supplierEntities.length > 0) {
          const supplier = supplierEntities[0].value;
          const supplierInfo = supplierDatabase[supplier];
          return `${supplier.charAt(0).toUpperCase() + supplier.slice(1)} has a rating of ${supplierInfo.rating}/5.0. They typically deliver within ${supplierInfo.deliveryTime} and specialize in ${supplierInfo.category} products. Would you like to review their catalog or performance history?`;
        }
      }
      return "I can help you find reliable suppliers or analyze your current supplier performance. Would you like supplier recommendations based on category, delivery time, or ratings?";
      
    case "report":
      return "I can generate procurement reports based on your data. Would you like a summary report, cost analysis, supplier performance report, or inventory status report?";
      
    case "pricing":
      if (entities.length > 0) {
        const productEntities = entities.filter(e => e.type === "product");
        if (productEntities.length > 0) {
          const product = productEntities[0].value;
          const productInfo = productDatabase[product];
          return `The current price for ${product} is ₹${productInfo.price}. This price was last updated on April 10, 2024. Would you like to see pricing trends or compare with alternative products?`;
        }
      }
      return "I can provide pricing analysis for any product in our catalog. Which product would you like pricing information on?";
      
    case "order":
      if (entities.length > 0) {
        const productEntities = entities.filter(e => e.type === "product");
        const quantityEntities = entities.filter(e => e.type === "quantity");
        
        if (productEntities.length > 0) {
          const product = productEntities[0].value;
          const quantity = quantityEntities.length > 0 ? quantityEntities[0].value : "standard";
          
          return `I'll help you place an order for ${quantity} units of ${product}. The recommended supplier is ${productDatabase[product].supplier}. Would you like to proceed with this order or modify any details?`;
        }
      }
      return "I can help you place a new order. Which product would you like to order and in what quantity?";
      
    default:
      return "I'm not sure I understood your request completely. Could you please provide more details about what you need help with in procurement? I can assist with inventory, suppliers, orders, reports, or pricing information.";
  }
}

export function processUserMessage(inputMessage: string, recentMessages: Message[] = []): string {
  // Build context from recent messages
  const contextString = recentMessages
    .slice(-3)
    .map(msg => msg.content)
    .join(" | ");
  
  // Process the message using NLP with context
  const nlpResult = processNLP(inputMessage, contextString);
  
  // Generate a contextual response
  return generateResponse(nlpResult, inputMessage, recentMessages);
}

// Export these functions for unit testing and future expansion
export const nlpHelpers = {
  detectIntent,
  extractEntities,
  analyzeSentiment,
  processNLP,
  buildContextSummary,
};
