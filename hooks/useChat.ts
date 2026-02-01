
import { useState, useCallback } from 'react';
import { Message, AgentState, ShoppingPreferences, StepData } from '../types';
import { generateId } from '../lib/utils';
import { streamGeminiResponse } from '../services/geminiService';

const INITIAL_PREFERENCES: ShoppingPreferences = {
  shoppingFor: 'self',
  budget: { min: 0, max: 5000, value: 1000, isHardLimit: false },
  priority: 50,
  brands: { selected: [], mode: 'include' },
};

const INITIAL_AGENT_STATE: AgentState = {
  intent: null,
  phase: 'idle',
  phaseProgress: 0,
  confidence: 0,
  isLive: false,
};

interface UseChatProps {
  onPlanReady?: (query: string, category: string, targetPrice: number) => void;
}

export function useChat(props?: UseChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [agentState, setAgentState] = useState<AgentState>(INITIAL_AGENT_STATE);
  const [preferences, setPreferences] = useState<ShoppingPreferences>(INITIAL_PREFERENCES);

  const updatePreferences = (newPrefs: ShoppingPreferences) => {
    setPreferences(newPrefs);
  };

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
    };

    const assistantId = generateId();
    const assistantMsg: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      steps: [],
      questions: [],
      sources: [],
      timestamp: Date.now(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setIsLoading(true);

    try {
      const stream = streamGeminiResponse(messages.concat(userMsg), content, preferences);

      for await (const event of stream) {
        switch (event.type) {
          case 'state_update':
            setAgentState(prev => ({ ...prev, ...event.data }));
            break;

          case 'plan_ready':
            if (props?.onPlanReady) {
              props.onPlanReady(event.data.query, event.data.category, event.data.target_price);
            }
            break;

          case 'step':
            setMessages(prev => prev.map(m => {
              if (m.id !== assistantId) return m;
              const currentSteps = m.steps || [];
              const lastStep = currentSteps[currentSteps.length - 1];
              if (lastStep && lastStep.title === event.data.title) {
                const updatedSteps = [...currentSteps];
                updatedSteps[updatedSteps.length - 1] = { ...lastStep, ...event.data };
                return { ...m, steps: updatedSteps };
              }
              return { ...m, steps: [...currentSteps, event.data] };
            }));
            break;

          case 'questions':
             setMessages(prev => prev.map(m => 
              m.id === assistantId ? { ...m, questions: event.data.questions } : m
            ));
            break;

          case 'preference_sync':
            const ext = event.data.extracted_preferences;
            if (ext) {
              setPreferences(prev => ({
                ...prev,
                shoppingFor: ext.shopping_for === 'gift' ? 'gift' : ext.shopping_for === 'self' ? 'self' : prev.shoppingFor,
                budget: ext.budget ? { ...prev.budget, value: ext.budget, isHardLimit: !!ext.budget_hard_limit } : prev.budget,
                brands: ext.brands ? { ...prev.brands, selected: ext.brands } : prev.brands,
                priority: ext.priority === 'price' ? 0 : ext.priority === 'quality' ? 100 : prev.priority
              }));
            }
            break;

          case 'response':
            setMessages(prev => prev.map(m => 
              m.id === assistantId ? { 
                ...m, 
                content: event.data.response_text, 
                products: event.data.products, 
                localStores: event.data.localStores, // Added this line to propagate map data
                sources: event.data.sources, 
                isStreaming: false 
              } : m
            ));
            break;
            
          case 'error':
             setMessages(prev => prev.map(m => 
              m.id === assistantId ? { ...m, content: event.data.message, isStreaming: false } : m
            ));
            break;
        }
      }
    } catch (error) {
      console.error("Stream Error", error);
      setMessages(prev => prev.map(m => 
        m.id === assistantId ? { ...m, content: "An unexpected error occurred.", isStreaming: false } : m
      ));
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setAgentState(prev => ({ ...prev, phase: 'idle', isLive: false }));
      }, 3000);
    }
  }, [messages, isLoading, preferences, props]);

  return {
    messages,
    isLoading,
    agentState,
    preferences,
    updatePreferences,
    sendMessage,
  };
}
