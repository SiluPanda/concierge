
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import { cn } from '../../lib/utils';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-dark-border bg-dark-bg/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-r from-primary-purple to-primary-pink p-2 rounded-lg text-white shadow-[0_0_15px_-3px_rgba(168,85,247,0.4)] group-hover:shadow-[0_0_20px_-3px_rgba(168,85,247,0.6)] transition-all duration-300">
              <ShoppingBag size={20} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-purple to-primary-pink bg-clip-text text-transparent">
              Concierge
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className={cn("text-[13px] font-medium transition-colors", isActive('/') ? "text-white" : "text-text-secondary hover:text-white")}
          >
            Home
          </Link>
          <Link 
            to="/chat" 
            className={cn("text-[13px] font-medium transition-colors", isActive('/chat') ? "text-white" : "text-text-secondary hover:text-white")}
          >
            Assistant
          </Link>
          <Link 
            to="/for-you" 
            className={cn("text-[13px] font-medium transition-colors", isActive('/for-you') ? "text-white" : "text-text-secondary hover:text-white")}
          >
            For You
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu size={20} />
          </Button>
          <div className="hidden md:flex items-center gap-2 text-[10px] font-medium text-indigo-300 bg-primary-purple/10 px-3 py-1 rounded-full border border-primary-purple/20">
            <Sparkles size={12} className="text-primary-pink" />
            <span>Powered by Gemini 3</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
