
import { useState, useEffect } from 'react';
import { PlannedPurchase, ShoppingPreferences } from '../types';
import { generateId } from '../lib/utils';

const STORAGE_KEY = 'concierge_planned_purchases';

export function usePlannedPurchases() {
  const [plans, setPlans] = useState<PlannedPurchase[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setPlans(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse plans", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  }, [plans]);

  const addPlan = (query: string, category: string, targetPrice: number, prefs: ShoppingPreferences) => {
    const newPlan: PlannedPurchase = {
      id: generateId(),
      query,
      category,
      targetPrice,
      currentPrice: targetPrice + (Math.random() * 50),
      status: 'tracking',
      lastChecked: Date.now(),
      preferences: { ...prefs },
      notificationsEnabled: true
    };
    setPlans(prev => [newPlan, ...prev]);
  };

  const removePlan = (id: string) => {
    setPlans(prev => prev.filter(p => p.id !== id));
  };

  // Mock a price drop event for a random plan after 5 seconds of use
  useEffect(() => {
    if (plans.length > 0 && !plans.some(p => p.status === 'price_drop')) {
      const timer = setTimeout(() => {
        setPlans(prev => {
          const newPlans = [...prev];
          const idx = Math.floor(Math.random() * newPlans.length);
          if (newPlans[idx]) {
            newPlans[idx] = {
              ...newPlans[idx],
              status: 'price_drop',
              currentPrice: newPlans[idx].targetPrice - (Math.random() * 20 + 5)
            };
          }
          return newPlans;
        });
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [plans]);

  return { plans, addPlan, removePlan };
}
