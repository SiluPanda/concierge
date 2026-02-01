import React, { useEffect } from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';
import Button from './Button';

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  side?: 'left' | 'right' | 'bottom';
}

const Sheet: React.FC<SheetProps> = ({ isOpen, onClose, children, title, side = 'right' }) => {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const sideStyles = {
    left: 'left-0 top-0 bottom-0 w-[320px] border-r border-dark-border transform transition-transform duration-300 ease-in-out',
    right: 'right-0 top-0 bottom-0 w-[320px] border-l border-dark-border transform transition-transform duration-300 ease-in-out',
    bottom: 'bottom-0 left-0 right-0 max-h-[85vh] rounded-t-2xl border-t border-dark-border transform transition-transform duration-300 ease-in-out',
  };

  const translateStyles = {
    left: isOpen ? 'translate-x-0' : '-translate-x-full',
    right: isOpen ? 'translate-x-0' : 'translate-x-full',
    bottom: isOpen ? 'translate-y-0' : 'translate-y-full',
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Content */}
      <div className={cn(
        "fixed bg-dark-card z-50 flex flex-col shadow-2xl",
        sideStyles[side],
        translateStyles[side]
      )}>
        <div className="flex items-center justify-between p-4 border-b border-dark-border">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X size={18} />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {children}
        </div>
      </div>
    </>
  );
};

export default Sheet;