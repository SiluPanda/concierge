
import { GoogleGenAI, Type } from "@google/genai";
import { Message, Product, ShoppingPreferences, Source, LocalStore } from "../types";
import { generateId } from "../lib/utils";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are Concierge, an intelligent agentic shopping assistant orchestrated by a state graph.
Your workflow involves nodes: Detect Category -> Ask Questions -> [Discover Products OR Create Planned Purchase] -> Present Results.

**State Machine Logic:**
1.  **Detect Intent & Category:** Identify the user's intent and automatically determine the product category (e.g., Electronics, Fashion, Home Decor) from the query.
2.  **Planned Purchase Path:** If the user wants to track a price or plan a future buy:
    - You MUST determine a 'target_price' and 'category'.
    - If either is missing, transition to 'ask_questions'.
3.  **Branching:**
    - If intent is Planned Purchase and data is ready: Transition to 'setup_planned_purchase'.
    - If intent is Buying Now: Transition to 'discover_products'.

**Response Format (Strict JSON):**
{
  "node": "ask_questions" | "present_results" | "setup_planned_purchase",
  "category": "detected_category_string",
  "monitor_ready": boolean,
  "monitor_data": {
    "query": "exact product search query",
    "target_price": 1200,
    "category": "detected_category_string"
  },
  "clarification_questions": [
    { 
      "text": "Question text?", 
      "options": ["Opt A", "Opt B"],
      "field_key": "target_price"
    }
  ],
  "response_text": "Short conversational response. Use the term 'Planned Purchase'."
}
`;

export async function* streamGeminiResponse(
  history: Message[], 
  currentQuery: string,
  currentPreferences: ShoppingPreferences
): AsyncGenerator<{ type: string; data: any }> {
  
  yield { type: 'state_update', data: { phase: 'detecting', isLive: true, confidence: 20 } };

  try {
    if (!process.env.API_KEY) throw new Error("No API Key");
    
    const model = 'gemini-3-flash-preview'; 
    const context = `
      CURRENT UI STATE:
      Budget: $${currentPreferences.budget.value}
      Context: ${currentPreferences.shoppingFor}
    `;

    const recentHistory = history.slice(-6).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const messageWithContext = `${context}\n\nUser Query: ${currentQuery}`;
    
    const chat = ai.chats.create({
      model: model,
      history: recentHistory,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json"
      }
    });

    const result = await chat.sendMessage({ message: messageWithContext });
    const text = result.text;
    if (!text) throw new Error("Empty response");
    const json = JSON.parse(text);

    // BRANCHING LOGIC
    if (json.node === 'ask_questions') {
      yield { type: 'state_update', data: { phase: 'clarifying', isLive: true, confidence: 60 } };
      const questions = json.clarification_questions.map((q: any) => ({
        id: generateId(),
        text: q.text,
        options: q.options
      }));
      yield { type: 'questions', data: { questions } };
      yield { type: 'response', data: { response_text: json.response_text || "I need a few more details to set this up as a Planned Purchase for you." } };
    } 
    else if (json.node === 'setup_planned_purchase' || json.monitor_ready) {
      yield { type: 'state_update', data: { phase: 'presenting', isLive: true, confidence: 90 } };
      yield { 
        type: 'plan_ready', 
        data: { 
          query: json.monitor_data?.query || currentQuery,
          category: json.monitor_data?.category || json.category || "General",
          target_price: json.monitor_data?.target_price || currentPreferences.budget.value
        } 
      };
      yield { type: 'response', data: { response_text: json.response_text || "Excellent. I've added this to your Planned Purchases. I'll check prices daily and let you know the moment they drop." } };
    }
    else {
      // Standard Discovery Path + Local Store Search
      yield { type: 'state_update', data: { phase: 'searching', isLive: true, confidence: 40 } };
      
      // 1. Online Search (Gemini 3 Flash)
      const discoveryConfig = {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              candidates: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT, 
                  properties: { 
                    name: { type: Type.STRING }, 
                    brand: { type: Type.STRING }, 
                    reason_to_buy: { type: Type.STRING },
                    buy_url: { type: Type.STRING, description: "Direct URL to purchase the product" }
                  } 
                } 
              }
            }
          }
      };

      const productPromise = ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Find top products for: "${currentQuery}". Category: ${json.category || 'detected'}.`,
        config: discoveryConfig
      });

      // 2. Local Store Search (Gemini 2.5 Flash - REQUIRED for Google Maps)
      // Sunnyvale Coordinates
      const SUNNYVALE_LAT = 37.3688;
      const SUNNYVALE_LNG = -122.0363;

      // We explicitly ask for JSON and use system instructions to reinforce it because googleMaps tool can cause the model to be chatty.
      const localStorePromise = ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Find 3 offline stores in Sunnyvale, CA that sell "${currentQuery}". 
                   Return a strictly valid JSON block with a 'stores' array containing: name, address, and estimated price (number) for the item.
                   Example: { "stores": [ { "name": "Best Buy", "address": "123 El Camino", "price": 99.99 } ] }`,
        config: {
          systemInstruction: "You are a local shopping assistant. You ONLY output JSON. You do not write conversational text.",
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: SUNNYVALE_LAT,
                longitude: SUNNYVALE_LNG
              }
            }
          }
        }
      });

      // Wait for both
      const [productRes, localRes] = await Promise.all([productPromise, localStorePromise]);

      // Process Products
      const productData = JSON.parse(productRes.text || '{"candidates":[]}');
      const products = (productData.candidates || []).map((p: any) => ({
        ...p,
        id: generateId(),
        price: currentPreferences.budget.value * (0.8 + Math.random() * 0.4),
        currency: 'USD',
        description: p.reason_to_buy,
        pros: [], cons: [], 
        buyUrl: p.buy_url || "" 
      }));

      // Process Local Stores
      let localStores: LocalStore[] = [];
      try {
        let text = localRes.text || '';
        
        // Clean up text to find JSON
        // Match code blocks with or without 'json' tag, or just find the first outer { } pair
        const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (codeBlockMatch) {
            text = codeBlockMatch[1];
        } else {
             // Fallback: Try to find the first { and last }
             const start = text.indexOf('{');
             const end = text.lastIndexOf('}');
             if (start !== -1 && end !== -1) {
                 text = text.substring(start, end + 1);
             }
        }

        const localData = JSON.parse(text);
        
        if (localData && Array.isArray(localData.stores)) {
            localStores = (localData.stores || []).map((s: any, index: number) => ({
              id: generateId(),
              name: s.name,
              address: s.address,
              price: typeof s.price === 'number' ? s.price : currentPreferences.budget.value,
              // Simulate slight offset from center for visualization since API doesn't always return coords in JSON
              latitude: SUNNYVALE_LAT + (Math.random() - 0.5) * 0.04,
              longitude: SUNNYVALE_LNG + (Math.random() - 0.5) * 0.04
            }));
        }
      } catch (e) {
        console.warn("Failed to parse local stores JSON", e);
      }

      yield { type: 'response', data: { 
        response_text: json.response_text || "I've found some excellent online options and local stores in Sunnyvale for you.",
        products: products.slice(0, 4),
        localStores: localStores
      }};
    }

    yield { type: 'state_update', data: { phase: 'complete', isLive: false, confidence: 100 } };

  } catch (error: any) {
    console.error("Gemini Error:", error);
    yield { type: 'error', data: { message: error.message || "I encountered an error. Please try again." } };
    yield { type: 'state_update', data: { phase: 'idle', isLive: false } };
  }
}
