

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  currency: string;
  description: string;
  pros: string[];
  cons: string[];
  imageUrl?: string;
  buyUrl?: string;
}

export interface Source {
  title: string;
  uri: string;
}

export interface CreditCard {
  id: string;
  name: string;
  network?: 'Visa' | 'Mastercard' | 'Amex' | 'Discover' | 'Other';
  last4?: string;
  color?: string;
}

export interface PlannedPurchase {
  id: string;
  query: string;
  category: string;
  targetPrice: number;
  currentPrice?: number;
  status: 'tracking' | 'price_drop' | 'expired';
  lastChecked: number;
  preferences: Partial<ShoppingPreferences>;
  notificationsEnabled: boolean;
}

export type AgentPhase =
  | 'idle'
  | 'load_preferences'
  | 'detecting'
  | 'clarifying'
  | 'extracting'
  | 'searching'
  | 'presenting'
  | 'complete';

export interface AgentState {
  intent: string | null;
  phase: AgentPhase;
  phaseProgress: number; // 0-100
  confidence: number;
  isLive: boolean;
}

export interface AgentStep {
  title: string;
}

export interface StepData {
  step: string;
  status: 'active' | 'completed' | 'pending';
  title: string;
}

export interface FieldMetadata {
  field_key: string;
  display_name: string;
  field_type: 'text' | 'number' | 'select' | 'size';
  ui_hint?: string;
  options?: string[];
}

export interface Question {
  id: string;
  text: string;
  options?: string[];
  fieldMetadata?: FieldMetadata;
}

export interface ShoppingPreferences {
  shoppingFor: 'self' | 'gift';
  budget: {
    min: number;
    max: number;
    value: number;
    isHardLimit: boolean;
  };
  priority: number; // 0 (Price) - 100 (Quality)
  brands: {
    selected: string[];
    mode: 'include' | 'exclude';
  };
}

export interface LocalStore {
  id: string;
  name: string;
  address: string;
  price: number;
  latitude?: number;
  longitude?: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  products?: Product[];
  localStores?: LocalStore[];
  steps?: StepData[]; 
  questions?: Question[];
  sources?: Source[];
  timestamp: number;
  isStreaming?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  agentState: AgentState;
  preferences: ShoppingPreferences;
}
