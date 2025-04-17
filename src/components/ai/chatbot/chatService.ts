
import { Intent, NLPResult, Entity, Message } from "./types";

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
function processNLP(message: string): NLPResult {
  const intent = detectIntent(message);
  const entities = extractEntities(message);
  const sentiment = analyzeSentiment(message);
  
  return {
    intent,
    confidence: entities.length > 0 ? 0.85 : 0.7,
    entities,
    sentiment,
  };
}

// Generate contextual responses based on NLP results
function generateResponse(nlpResult: NLPResult, message: string): string {
  const { intent, entities, sentiment } = nlpResult;
  
  // Handle different intents
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

export function processUserMessage(inputMessage: string): string {
  // Process the message using NLP
  const nlpResult = processNLP(inputMessage);
  
  // Generate a contextual response
  return generateResponse(nlpResult, inputMessage);
}

// Export these functions for unit testing and future expansion
export const nlpHelpers = {
  detectIntent,
  extractEntities,
  analyzeSentiment,
  processNLP,
};
