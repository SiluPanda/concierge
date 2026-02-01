import React, { useState } from 'react';
import { CreditCard } from '../../types';
import Button from '../ui/Button';
import { Plus, Trash2, CreditCard as CardIcon, Check, X, Wallet } from 'lucide-react';
import { cn } from '../../lib/utils';

interface WalletPanelProps {
  cards: CreditCard[];
  onAddCard: (name: string) => void;
  onRemoveCard: (id: string) => void;
}

const POPULAR_CARDS = [
  "Chase Sapphire Reserve",
  "Chase Sapphire Preferred",
  "American Express Gold Card",
  "American Express Platinum Card",
  "Capital One Venture X",
  "Citi Premier Card",
  "Discover it Cash Back",
  "Blue Cash Preferred® Card from American Express",
  "Bilt World Elite Mastercard®",
  "Apple Card",
  "Wells Fargo Active Cash",
  "Bank of America® Premium Rewards®"
];

const WalletPanel: React.FC<WalletPanelProps> = ({ cards, onAddCard, onRemoveCard }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCardName, setSelectedCardName] = useState(POPULAR_CARDS[0]);

  const handleAdd = () => {
    onAddCard(selectedCardName);
    setIsAdding(false);
    setSelectedCardName(POPULAR_CARDS[0]);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-dark-elevated rounded-xl p-4 border border-dark-border">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-purple/10 rounded-lg text-primary-purple">
                <Wallet size={20} />
            </div>
            <div>
                <h3 className="text-sm font-semibold text-white">Your Wallet</h3>
                <p className="text-xs text-text-muted">Manage your payment methods for instant checkout.</p>
            </div>
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Linked Cards</h4>
            <span className="text-xs text-text-muted">{cards.length} cards</span>
        </div>

        {cards.map((card) => (
          <div key={card.id} className="group relative overflow-hidden rounded-xl bg-dark-card border border-dark-border transition-all hover:border-primary-purple/30">
            {/* Card Visual Background */}
            <div className={cn("absolute inset-0 opacity-10 bg-gradient-to-br", card.color || "from-gray-700 to-gray-900")} />
            
            <div className="relative p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                    "w-10 h-7 rounded flex items-center justify-center text-[10px] font-bold text-white shadow-sm bg-gradient-to-br",
                    card.color || "from-gray-600 to-gray-800"
                )}>
                    {card.network === 'Amex' ? 'AMEX' : card.network?.toUpperCase().slice(0, 4) || 'CARD'}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{card.name}</p>
                  <p className="text-xs text-text-muted font-mono">•••• {card.last4}</p>
                </div>
              </div>
              
              <button 
                onClick={() => onRemoveCard(card.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-text-muted hover:text-red-400 transition-all"
                title="Remove card"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Section */}
      {isAdding ? (
        <div className="bg-dark-elevated rounded-xl p-4 border border-dark-border animate-fade-in space-y-4">
            <div className="space-y-2">
                <label className="text-xs font-medium text-text-secondary">Select Card</label>
                <div className="relative">
                    <select
                        value={selectedCardName}
                        onChange={(e) => setSelectedCardName(e.target.value)}
                        className="w-full appearance-none bg-dark-card border border-dark-border-active rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-purple transition-colors"
                    >
                        {POPULAR_CARDS.map((card) => (
                            <option key={card} value={card} className="bg-dark-card text-white">
                                {card}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>
            </div>

            <div className="flex gap-2 pt-2">
                <Button variant="primary" size="sm" onClick={handleAdd} className="flex-1">
                    <Check size={16} className="mr-1.5" /> Add Card
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setIsAdding(false)}>
                    Cancel
                </Button>
            </div>
        </div>
      ) : (
        <Button 
            variant="outline" 
            className="w-full border-dashed border-dark-border-active hover:bg-dark-elevated hover:border-primary-purple/50 text-text-secondary hover:text-white"
            onClick={() => setIsAdding(true)}
        >
            <Plus size={16} className="mr-2" />
            Add New Card
        </Button>
      )}
    </div>
  );
};

export default WalletPanel;