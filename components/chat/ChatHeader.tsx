
import React from 'react';
import { User, CreditCard, Target, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface ChatHeaderProps {
  user?: { name?: string; email?: string } | null;
  onLogout?: () => void;
  cardCount: number;
  planCount: number;
  hasAlert: boolean;
  onCardsClick: () => void;
  onPlansClick: () => void;
  onProfileClick: () => void;
}

export function ChatHeader({ 
  user, 
  onLogout, 
  cardCount, 
  planCount, 
  hasAlert, 
  onCardsClick, 
  onPlansClick, 
  onProfileClick 
}: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-dark-border bg-dark-bg/80 backdrop-blur-md sticky top-0 z-30">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="bg-gradient-to-r from-primary-purple to-primary-pink p-1.5 rounded-lg text-white shadow-sm group-hover:shadow-md transition-all">
            <span className="text-lg">🛍️</span>
        </div>
        <span className="text-base font-semibold text-white tracking-tight">Concierge</span>
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Planned Purchases - Positioned to the left of cards */}
        <button
          onClick={onPlansClick}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 bg-dark-elevated border border-dark-border rounded-lg text-text-secondary text-xs hover:text-white hover:border-dark-border-active transition-all relative",
            hasAlert && "border-primary-pink/50 text-white shadow-[0_0_10px_-2px_rgba(236,72,153,0.3)]"
          )}
        >
          <Target size={14} className={cn(hasAlert && "text-primary-pink animate-pulse")} />
          <span className="hidden sm:inline font-medium">Planned Purchases</span>
          <span className="bg-white/5 px-1.5 rounded text-[10px]">{planCount}</span>
          {hasAlert && (
             <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-pink opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-pink"></span>
             </span>
          )}
        </button>

        {/* Card Count */}
        <button
          onClick={onCardsClick}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-elevated border border-dark-border rounded-lg text-text-secondary text-xs hover:text-white hover:border-dark-border-active transition-all"
        >
          <CreditCard size={14} />
          <span>{cardCount}</span>
        </button>

        {/* Profile */}
        <button
          onClick={onProfileClick}
          className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-purple to-primary-pink border-0 cursor-pointer flex items-center justify-center hover:opacity-90 transition-opacity shadow-lg ml-1"
          aria-label="Open profile"
        >
          <User size={16} className="text-white" />
        </button>
      </div>
    </header>
  );
}
