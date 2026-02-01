import React from 'react';

interface WelcomeScreenProps {
  onQuerySelect: (query: string) => void;
}

const SUGGESTED_QUERIES = [
  { emoji: '👟', text: 'Running shoes under $150' },
  { emoji: '💻', text: 'Laptop for programming' },
  { emoji: '👖', text: 'Slim fit jeans size 32' },
  { emoji: '🎧', text: 'Noise cancelling headphones' },
];

export function WelcomeScreen({ onQuerySelect }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center animate-fade-in">
      <div className="mb-8 p-6 bg-gradient-to-br from-primary-purple/10 to-primary-pink/10 rounded-full border border-primary-purple/20 shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)]">
        <span className="text-4xl">🛍️</span>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
        What can I help you find?
      </h1>

      <p className="text-sm text-text-secondary mb-10 max-w-sm">
        Your personal AI concierge that researches, compares, and discovers the best products for you.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
        {SUGGESTED_QUERIES.map((query, i) => (
          <button
            key={i}
            onClick={() => onQuerySelect(query.text)}
            className="p-4 bg-dark-card border border-dark-border hover:border-primary-purple/50 rounded-xl text-left transition-all hover:bg-dark-elevated group"
          >
            <span className="text-xl mb-2 block group-hover:scale-110 transition-transform duration-200">{query.emoji}</span>
            <span className="text-sm text-gray-200 font-medium">{query.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}