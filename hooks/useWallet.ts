import { useState } from 'react';
import { CreditCard } from '../types';
import { generateId } from '../lib/utils';

const INITIAL_CARDS: CreditCard[] = [
  { id: '1', name: 'Chase Sapphire Reserve', network: 'Visa', last4: '4242', color: 'from-blue-700 to-blue-900' },
  { id: '2', name: 'American Express Gold', network: 'Amex', last4: '1005', color: 'from-yellow-400 to-yellow-600' },
];

export function useWallet() {
  const [cards, setCards] = useState<CreditCard[]>(INITIAL_CARDS);

  const addCard = (name: string) => {
    let network: CreditCard['network'] = 'Visa';
    let color = 'from-gray-700 to-gray-900';

    if (name.includes('American Express') || name.includes('Amex')) {
      network = 'Amex';
      color = name.includes('Gold') ? 'from-yellow-400 to-yellow-600' : 
              name.includes('Platinum') ? 'from-gray-300 to-gray-400' : 
              'from-blue-400 to-blue-600';
    } else if (name.includes('Mastercard')) {
      network = 'Mastercard';
      color = 'from-orange-600 to-red-600';
    } else if (name.includes('Discover')) {
      network = 'Discover';
      color = 'from-orange-500 to-orange-700';
    } else if (name.includes('Chase')) {
        color = 'from-blue-800 to-blue-950';
    } else if (name.includes('Apple')) {
        color = 'from-gray-200 to-white';
        network = 'Mastercard';
    }

    const newCard: CreditCard = {
      id: generateId(),
      name,
      network,
      last4: Math.floor(1000 + Math.random() * 9000).toString(),
      color
    };
    
    setCards([...cards, newCard]);
  };

  const removeCard = (id: string) => {
    setCards(cards.filter(c => c.id !== id));
  };

  return { cards, addCard, removeCard };
}