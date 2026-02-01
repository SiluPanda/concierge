import React from 'react';
import { SlidersHorizontal, History } from 'lucide-react';

interface BottomNavProps {
  onFiltersClick: () => void;
  onHistoryClick: () => void;
  filtersActive: boolean;
  historyActive: boolean;
  historyCount: number;
  disabled?: boolean;
}

export function BottomNav({
  onFiltersClick,
  onHistoryClick,
  filtersActive,
  historyActive,
  historyCount,
  disabled,
}: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-center gap-4 p-4 bg-gradient-to-t from-dark-bg via-dark-bg/90 to-transparent pointer-events-none z-10 pb-8">
      <button
        onClick={onFiltersClick}
        disabled={disabled}
        className={`flex items-center gap-2 px-5 py-3 rounded-full border shadow-lg backdrop-blur-md pointer-events-auto transition-all ${
            filtersActive 
                ? 'bg-primary-purple text-white border-primary-purple' 
                : 'bg-dark-elevated/90 text-text-secondary border-dark-border hover:bg-dark-card hover:text-white'
        }`}
      >
        <SlidersHorizontal size={18} />
        <span className="text-sm font-medium">Controls</span>
      </button>

      <button
        onClick={onHistoryClick}
        disabled={disabled}
        className={`flex items-center gap-2 px-5 py-3 rounded-full border shadow-lg backdrop-blur-md pointer-events-auto transition-all ${
            historyActive 
                ? 'bg-primary-purple text-white border-primary-purple' 
                : 'bg-dark-elevated/90 text-text-secondary border-dark-border hover:bg-dark-card hover:text-white'
        }`}
      >
        <History size={18} />
        <span className="text-sm font-medium">History</span>
        {historyCount > 0 && (
          <span className="flex items-center justify-center min-w-[18px] h-[18px] bg-primary-pink text-white text-[10px] font-bold rounded-full px-1">
            {historyCount}
          </span>
        )}
      </button>
    </nav>
  );
}