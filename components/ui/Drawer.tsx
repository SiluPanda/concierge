import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  side?: 'left' | 'right';
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function Drawer({ isOpen, onClose, side = 'right', children, title, className }: DrawerProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
      return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'drawer-title' : undefined}
        className={cn(
          "fixed top-0 bottom-0 w-80 max-w-full bg-dark-card border-dark-border z-50 flex flex-col transition-transform duration-300 ease-in-out",
          side === 'right' ? "right-0 border-l" : "left-0 border-r",
          isOpen ? "translate-x-0" : side === 'right' ? "translate-x-full" : "-translate-x-full",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-dark-border">
          {title && (
            <h2 id="drawer-title" className="text-base font-semibold text-white m-0">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            aria-label="Close drawer"
            className="text-text-secondary hover:text-white p-1 rounded-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 custom-scrollbar">
          {children}
        </div>
      </div>
    </>
  );
}