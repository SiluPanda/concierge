import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
}

const variantStyles = {
  primary: 'bg-gradient-to-r from-primary-purple to-primary-pink text-white hover:from-purple-600 hover:to-pink-600 shadow-lg border-0',
  secondary: 'bg-dark-elevated border border-dark-border text-white hover:bg-dark-border-active',
  ghost: 'bg-transparent text-text-secondary hover:bg-white/5 hover:text-white border-0 shadow-none',
  outline: 'bg-transparent border border-white/10 text-white hover:bg-white/5 shadow-none',
};

const sizeStyles = {
  sm: 'px-3 py-2 text-sm h-8',
  md: 'px-4 py-2 text-base h-10',
  lg: 'px-6 py-3 text-lg h-12',
  icon: 'h-10 w-10 p-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, className, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        aria-disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary-purple focus:ring-offset-2 focus:ring-offset-dark-bg',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2" aria-live="polite">
            <Loader2 className="animate-spin h-4 w-4" aria-hidden="true" />
            <span>Loading...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;