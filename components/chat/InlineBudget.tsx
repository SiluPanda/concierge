import React from 'react';

interface InlineBudgetProps {
  value: number;
  min: number;
  max: number;
  isHardLimit: boolean;
  onChange: (value: number) => void;
  onHardLimitChange: (isHard: boolean) => void;
  disabled?: boolean;
}

export function InlineBudget({
  value,
  min,
  max,
  isHardLimit,
  onChange,
  onHardLimitChange,
  disabled,
}: InlineBudgetProps) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-dark-elevated border border-dark-border rounded-full w-fit">
      <span className="text-xs text-text-secondary font-medium">Budget:</span>

      <span className="text-sm font-bold text-white min-w-[50px]">
        ${value}
      </span>

      <input
        type="range"
        min={min}
        max={max}
        step={50}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="w-24 h-1 bg-dark-border-active rounded-lg appearance-none cursor-pointer accent-primary-purple"
      />

      <button
        onClick={() => onHardLimitChange(!isHardLimit)}
        disabled={disabled}
        className={`px-2 py-1 text-[10px] font-medium rounded-md transition-colors ${
            isHardLimit 
                ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                : 'bg-dark-card text-text-muted border border-dark-border hover:text-white'
        }`}
      >
        {isHardLimit ? '🔒 Strict' : '🔓 Soft'}
      </button>
    </div>
  );
}