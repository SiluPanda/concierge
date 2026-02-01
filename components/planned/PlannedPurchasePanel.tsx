
import React, { useState } from 'react';
import { PlannedPurchase, ShoppingPreferences } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Target, Trash2, TrendingDown, Clock, Bell, Sparkles, ChevronRight, ShoppingCart, Plus, Check, X } from 'lucide-react';
import { cn, formatCurrency } from '../../lib/utils';

interface PlannedPurchasePanelProps {
  plans: PlannedPurchase[];
  onRemove: (id: string) => void;
  onAddManual: (query: string, targetPrice: number) => void;
  onPlanClick?: (plan: PlannedPurchase) => void;
}

const PlannedPurchasePanel: React.FC<PlannedPurchasePanelProps> = ({ plans, onRemove, onAddManual, onPlanClick }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newQuery, setNewQuery] = useState('');
  const [newPrice, setNewPrice] = useState('100');

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuery || !newPrice) return;
    onAddManual(newQuery, parseFloat(newPrice));
    setNewQuery('');
    setNewPrice('100');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      {/* Active Monitors Header */}
      <div className="bg-dark-elevated rounded-xl p-4 border border-dark-border">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-pink/10 rounded-lg text-primary-pink">
                <Target size={20} />
            </div>
            <div>
                <h3 className="text-sm font-semibold text-white">Planned Purchases</h3>
                <p className="text-xs text-text-muted">Concierge checks for price drops every 24 hours.</p>
            </div>
        </div>
      </div>

      {/* Add Manual Form / Button */}
      {isAdding ? (
        <form onSubmit={handleManualSubmit} className="bg-dark-elevated rounded-xl p-4 border border-primary-purple/30 animate-fade-in space-y-4 shadow-lg">
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1 block">Product Intent</label>
              <Input 
                value={newQuery}
                onChange={(e) => setNewQuery(e.target.value)}
                placeholder="e.g. Sony WH-1000XM5"
                className="h-9 text-xs"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1 block">Target Price ($)</label>
              <Input 
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="h-9 text-xs"
                required
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="primary" size="sm" className="flex-1 h-8 text-[11px]">
              <Check size={14} className="mr-1.5" /> Save Plan
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsAdding(false)} className="h-8 text-[11px]">
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button 
          variant="outline" 
          className="w-full border-dashed border-dark-border-active hover:bg-dark-elevated hover:border-primary-purple/50 text-text-secondary hover:text-white group transition-all"
          onClick={() => setIsAdding(true)}
        >
          <Plus size={16} className="mr-2 group-hover:rotate-90 transition-transform" />
          Add Planned Purchase
        </Button>
      )}

      {plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center space-y-3 opacity-50">
          <Target size={40} className="text-text-muted" />
          <p className="text-xs text-text-muted">No planned purchases yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Active Plans</h4>
              <span className="text-xs text-text-muted">{plans.length} active</span>
          </div>

          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={cn(
                "group relative overflow-hidden rounded-xl bg-dark-card border transition-all duration-300",
                plan.status === 'price_drop' 
                  ? "border-emerald-500/50 shadow-[0_0_15px_-5px_rgba(16,185,129,0.3)] bg-emerald-500/5" 
                  : "border-dark-border hover:border-primary-purple/30"
              )}
            >
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                        {plan.category && (
                          <span className="text-[10px] font-bold text-primary-purple uppercase tracking-widest">{plan.category}</span>
                        )}
                        {plan.status === 'price_drop' && (
                          <span className="bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded animate-pulse">
                            PRICE DROP
                          </span>
                        )}
                    </div>
                    <h5 className="text-sm font-semibold text-white group-hover:text-primary-purple transition-colors">{plan.query}</h5>
                  </div>
                  <button 
                    onClick={() => onRemove(plan.id)}
                    className="p-1.5 text-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                      <p className="text-[10px] text-text-muted uppercase font-medium">Target Price</p>
                      <p className="text-sm font-bold text-white">{formatCurrency(plan.targetPrice)}</p>
                  </div>
                  <div className="space-y-1">
                      <p className="text-[10px] text-text-muted uppercase font-medium">Current Low</p>
                      <p className={cn(
                          "text-sm font-bold",
                          plan.status === 'price_drop' ? "text-emerald-400" : "text-white"
                      )}>
                        {plan.currentPrice ? formatCurrency(plan.currentPrice) : 'Scanning...'}
                      </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                      <Clock size={10} />
                      <span>Checked 4h ago</span>
                  </div>
                  {plan.status === 'price_drop' ? (
                    <Button variant="primary" size="sm" className="h-7 text-[10px] px-3">
                      Buy Now <ShoppingCart size={10} className="ml-1.5" />
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                        <TrendingDown size={10} />
                        <span>Tracking for drops</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="p-4 rounded-xl bg-dark-elevated border border-dashed border-dark-border text-center">
         <p className="text-[10px] text-text-muted leading-relaxed">
            Our agents simulate real users checking top retailers daily. Categories are automatically detected from your intent.
         </p>
      </div>
    </div>
  );
};

export default PlannedPurchasePanel;
