import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ChatInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSend: (message: string) => void;
  isLoading?: boolean; // mapped to disabled
  placeholder?: string;
}

export function ChatInput({ value: propValue, onChange, onSend, isLoading, placeholder = "What are you looking for?" }: ChatInputProps) {
  // Internal state if uncontrolled (fallback)
  const [internalValue, setInternalValue] = React.useState('');
  const isControlled = propValue !== undefined;
  const inputValue = isControlled ? propValue : internalValue;
  
  const handleChange = (val: string) => {
    if (onChange) onChange(val);
    if (!isControlled) setInternalValue(val);
  };

  const handleSend = () => {
    if (inputValue.trim() && !isLoading) {
        onSend(inputValue);
        if (!isControlled) setInternalValue('');
        else if (onChange) onChange(''); 
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full bg-dark-bg border-t border-dark-border p-4 z-20">
        <div className="max-w-3xl mx-auto flex items-center gap-3 p-3 bg-dark-card border border-dark-border rounded-2xl focus-within:ring-2 focus-within:ring-primary-purple/20 focus-within:border-primary-purple transition-all">
        <input
            type="text"
            value={inputValue}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder:text-text-muted"
        />
        <button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 border-none cursor-pointer",
                inputValue.trim() && !isLoading
                    ? "bg-gradient-to-r from-primary-purple to-primary-pink text-white shadow-md hover:shadow-lg hover:scale-105" 
                    : "bg-dark-elevated text-text-muted cursor-not-allowed"
            )}
            aria-label="Send message"
        >
            <Send size={18} className={inputValue.trim() ? "ml-0.5" : ""} />
        </button>
        </div>
        <div className="text-center mt-2">
            <span className="text-[10px] text-text-muted">
                Concierge AI can make mistakes. Please verify important information.
            </span>
        </div>
    </div>
  );
}

export default ChatInput;