import { Product, StepData, Question } from '../../types';

export type { Product, StepData, Question };

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  products?: Product[];
  steps?: StepData[];
  questions?: Question[]; // Using basic Question from global types for now
  isStreaming?: boolean;
  timestamp: number;
  thinkingTime?: number;
  needsClarification?: boolean;
  category?: string;
  contextSwitched?: boolean;
}

export interface StructuredQuestion {
  id: string;
  question: string;
  type: 'single_select' | 'multi_select' | 'text' | 'number';
  options?: { value: string; label: string }[];
  required: boolean;
}

export interface ExtractedPreferences {
  detected_budget?: number;
  budget_is_hard_limit?: boolean;
  detected_brands?: string[];
  detected_stores?: string[];
  category_price_range?: {
    min: number;
    max: number;
    typical: number;
  };
}

export interface ResponseData {
  response: string;
  conversation_id?: string;
  thread_id?: string;
  category?: string;
  needs_clarification?: boolean;
  context_switched?: boolean;
  thinking_time?: number;
  // field_metadata?: FieldMetadata[]; 
  questions?: string[];
  structured_questions?: StructuredQuestion[];
  extracted_preferences?: ExtractedPreferences;
}