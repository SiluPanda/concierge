import React from 'react';
import { ShoppingPreferences } from '../../types';
import { cn, formatCurrency } from '../../lib/utils';
import { X, DollarSign, BarChart3, Tag, Gift, User } from 'lucide-react';
import Button from '../ui/Button';

interface StructuredControlsProps {
  preferences: ShoppingPreferences;
  onUpdate: (prefs: ShoppingPreferences) => void;
}

const StructuredControls: React.FC<StructuredControlsProps> = ({ preferences, onUpdate }) => {
  
  const handleBudgetChange = (val: number) => {
    onUpdate({
      ...preferences,
      budget: { ...preferences.budget, value: val }
    });
  };

  const handlePriorityChange = (val: number) => {
    onUpdate({
      ...preferences,
      priority: val
    });
  };

  const toggleBrand = (brand: string) => {
    const current = preferences.brands.selected;
    const newSelected = current.includes(brand)
      ? current.filter(b => b !== brand)
      : [...current, brand];
    
    onUpdate({
      ...preferences,
      brands: { ...preferences.brands, selected: newSelected }
    });
  };

  const POPULAR_BRANDS = ['Apple', 'Samsung', 'Sony', 'Dell', 'HP', 'Lenovo', 'Asus', 'Nike', 'Adidas'];

  return (
    <div className="space-y-8">
      {/* Shopping Context */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <Gift size={16} className="text-primary-pink" />
            Shopping Context
          </div>
        </div>
        <div className="flex bg-dark-elevated rounded-xl p-1 border border-dark-border">
          <button
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg transition-all",
              preferences.shoppingFor === 'self' 
                ? "bg-dark-card border border-dark-border text-white shadow-sm" 
                : "text-text-muted hover:text-white"
            )}
            onClick={() => onUpdate({ ...preferences, shoppingFor: 'self' })}
          >
            <User size={14} /> For Myself
          </button>
          <button
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg transition-all",
              preferences.shoppingFor === 'gift' 
                ? "bg-dark-card border border-dark-border text-white shadow-sm" 
                : "text-text-muted hover:text-white"
            )}
            onClick={() => onUpdate({ ...preferences, shoppingFor: 'gift' })}
          >
            <Gift size={14} /> As a Gift
          </button>
        </div>
      </div>

      {/* Budget Control */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <DollarSign size={16} className="text-primary-purple" />
            Budget Limit
          </div>
          <span className="text-primary-pink font-bold bg-primary-pink/10 px-2 py-0.5 rounded text-xs">
            {formatCurrency(preferences.budget.value)}
          </span>
        </div>
        <div className="relative h-6 flex items-center">
          <input
            type="range"
            min={preferences.budget.min}
            max={preferences.budget.max}
            step={50}
            value={preferences.budget.value}
            onChange={(e) => handleBudgetChange(parseInt(e.target.value))}
            className="w-full h-1.5 bg-dark-elevated rounded-lg appearance-none cursor-pointer accent-primary-purple hover:accent-primary-pink transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
            <input 
                type="checkbox" 
                id="hardLimit"
                checked={preferences.budget.isHardLimit}
                onChange={(e) => onUpdate({...preferences, budget: {...preferences.budget, isHardLimit: e.target.checked}})}
                className="rounded border-dark-border bg-dark-elevated text-primary-purple focus:ring-primary-purple/50" 
            />
            <label htmlFor="hardLimit" className="text-xs text-text-secondary cursor-pointer select-none">Strictly under budget</label>
        </div>
      </div>

      {/* Priority Control */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <BarChart3 size={16} className="text-emerald-500" />
            Optimization Goal
          </div>
        </div>
        <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-text-muted uppercase tracking-wider font-bold">
                <span>Lowest Price</span>
                <span>Highest Quality</span>
            </div>
            <div className="relative h-6 flex items-center">
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={preferences.priority}
                    onChange={(e) => handlePriorityChange(parseInt(e.target.value))}
                    className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                    style={{
                        background: `linear-gradient(to right, #22c55e 0%, #f59e0b 50%, #ec4899 100%)`
                    }}
                />
            </div>
        </div>
      </div>

      {/* Brand Control */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <Tag size={16} className="text-blue-400" />
            Preferred Brands
          </div>
          <div className="flex bg-dark-elevated rounded-lg p-0.5">
             <button 
                className={cn("px-2 py-0.5 text-[10px] rounded-md transition-all", preferences.brands.mode === 'include' ? "bg-dark-border text-white shadow-sm" : "text-text-muted")}
                onClick={() => onUpdate({...preferences, brands: {...preferences.brands, mode: 'include'}})}
             >
                 Include
             </button>
             <button 
                className={cn("px-2 py-0.5 text-[10px] rounded-md transition-all", preferences.brands.mode === 'exclude' ? "bg-dark-border text-white shadow-sm" : "text-text-muted")}
                onClick={() => onUpdate({...preferences, brands: {...preferences.brands, mode: 'exclude'}})}
             >
                 Exclude
             </button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
            {POPULAR_BRANDS.map(brand => {
                const isSelected = preferences.brands.selected.includes(brand);
                return (
                    <button
                        key={brand}
                        onClick={() => toggleBrand(brand)}
                        className={cn(
                            "px-3 py-1.5 rounded-full text-xs transition-all border",
                            isSelected 
                                ? "bg-primary-purple/20 border-primary-purple text-white shadow-[0_0_10px_-3px_rgba(99,102,241,0.3)]" 
                                : "bg-dark-elevated border-dark-border text-text-secondary hover:border-text-muted"
                        )}
                    >
                        {brand}
                        {isSelected && <span className="ml-1.5 opacity-50">×</span>}
                    </button>
                )
            })}
        </div>
      </div>
    </div>
  );
};

export default StructuredControls;