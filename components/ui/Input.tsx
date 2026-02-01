import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-xl border border-dark-border-active bg-dark-card px-4 py-2 text-[14px] text-white placeholder:text-text-muted focus:outline-none focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/10 transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
export default Input;