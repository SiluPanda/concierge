// Simple mock implementation as react-query isn't set up yet
import { useState, useEffect } from 'react';

interface Wallet {
  total_cards: number;
  cards: any[];
}

export function useUserWallet(token: string | null) {
    const [wallet, setWallet] = useState<Wallet>({ total_cards: 0, cards: [] });
    const [isLoading, setIsLoading] = useState(false);
    
    // Mock fetch
    useEffect(() => {
        if(token) {
            setIsLoading(true);
            setTimeout(() => {
                setWallet({ total_cards: 2, cards: [{id: '1', name: 'Visa Infinite'}]});
                setIsLoading(false);
            }, 500);
        }
    }, [token]);

    return { wallet, isLoading, error: null };
}