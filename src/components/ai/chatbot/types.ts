
export type Message = {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
  context?: string; // For storing conversation context
  intent?: string; // For storing detected user intent
};

export type Intent = 'help' | 'inventory' | 'supplier' | 'report' | 'pricing' | 'order' | 'unknown';

export type EntityType = 'product' | 'supplier' | 'date' | 'quantity' | 'price' | 'location';

export type Entity = {
  type: EntityType;
  value: string;
  confidence: number;
};

export type NLPResult = {
  intent: Intent;
  confidence: number;
  entities: Entity[];
  sentiment: 'positive' | 'neutral' | 'negative';
};

export type ConversationContext = {
  recentMessages: Message[];
  detectedEntities: Entity[];
  currentIntent?: Intent;
  conversationSummary?: string;
};
