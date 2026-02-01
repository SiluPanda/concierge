
import React, { useState } from 'react';
import { LocalStore } from '../../types';
import { MapPin, Navigation, Store, X, Scan, Target } from 'lucide-react';
import { cn, formatCurrency } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface MapWidgetProps {
  stores: LocalStore[];
  centerLabel?: string;
}

const MapWidget: React.FC<MapWidgetProps> = ({ stores, centerLabel = "Sunnyvale, CA" }) => {
  const [activeStore, setActiveStore] = useState<string | null>(null);

  return (
    <div className="w-full mt-4 rounded-xl overflow-hidden border border-dark-border bg-dark-elevated shadow-2xl flex flex-col md:flex-row h-[400px] md:h-[320px]">
      
      {/* Sidebar List */}
      <div className="w-full md:w-1/3 bg-dark-card border-b md:border-b-0 md:border-r border-dark-border flex flex-col">
        <div className="p-3 border-b border-dark-border bg-dark-elevated flex justify-between items-center">
          <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
            <Store size={14} className="text-primary-pink" />
            Available Nearby
          </h3>
          <span className="text-[10px] bg-primary-purple/10 text-primary-purple px-1.5 py-0.5 rounded font-mono">
            {stores.length} found
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
          {stores.map((store) => (
            <button
              key={store.id}
              onClick={() => setActiveStore(store.id)}
              className={cn(
                "w-full text-left p-3 rounded-lg border transition-all duration-200 group relative overflow-hidden",
                activeStore === store.id 
                  ? "bg-primary-purple/10 border-primary-purple/50" 
                  : "bg-dark-elevated border-transparent hover:border-dark-border-active hover:bg-dark-bg"
              )}
            >
              {activeStore === store.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary-purple" />
              )}
              <div className="flex justify-between items-start mb-1">
                <span className={cn("text-sm font-semibold truncate", activeStore === store.id ? "text-white" : "text-text-secondary group-hover:text-white")}>
                  {store.name}
                </span>
                <span className="text-xs font-bold text-white bg-white/10 px-1.5 py-0.5 rounded">
                  {formatCurrency(store.price)}
                </span>
              </div>
              <p className="text-[10px] text-text-muted line-clamp-1 flex items-center gap-1">
                <MapPin size={10} /> {store.address}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Map Area */}
      <div className="relative flex-1 bg-[#0f0f0f] overflow-hidden group border-l border-dark-border">
        {/* CSS Tech Map Background - Replaces broken external image */}
        <div className="absolute inset-0">
            {/* Base Grid */}
            <div 
                className="absolute inset-0 opacity-15" 
                style={{ 
                    backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }} 
            />
            {/* Sub Grid */}
            <div 
                className="absolute inset-0 opacity-5" 
                style={{ 
                    backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                    backgroundSize: '10px 10px'
                }} 
            />
            
            {/* Radar Elements */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Concentric circles */}
                <div className="w-[250px] h-[250px] rounded-full border border-primary-purple/10" />
                <div className="w-[450px] h-[450px] rounded-full border border-primary-purple/5" />
                
                {/* Crosshairs */}
                <div className="absolute w-full h-[1px] bg-primary-purple/10" />
                <div className="absolute h-full w-[1px] bg-primary-purple/10" />
            </div>

            {/* Scanning Radar Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-pulse-subtle pointer-events-none" />
        </div>

        {/* Center Label (Search Origin) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none group">
            <div className="relative">
                <div className="w-4 h-4 rounded-full bg-primary-purple/20 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-purple animate-pulse" />
                </div>
                <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-mono text-primary-purple/70 bg-black/50 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    SEARCH ORIGIN
                </div>
            </div>
        </div>

        {/* Store Pins */}
        {stores.map((store, index) => {
            // Calculate mock relative positions
            // Ensure they are somewhat scattered but within view
            const latOffset = (store.latitude || 37.3688) - 37.3688;
            const lngOffset = (store.longitude || -122.0363) - (-122.0363);
            
            // Map offsets to percentage (50% is center)
            // Scale factor: 0.05 degrees is roughly edges of view
            const scale = 800; 
            const top = 50 - (latOffset * scale); 
            const left = 50 + (lngOffset * scale);

            // Clamp to avoid pins going off map
            const clampedTop = Math.max(15, Math.min(85, top));
            const clampedLeft = Math.max(15, Math.min(85, left));

            const isActive = activeStore === store.id;

            return (
                <div 
                    key={store.id}
                    className="absolute transition-all duration-500 z-10"
                    style={{ top: `${clampedTop}%`, left: `${clampedLeft}%` }}
                >
                    <button
                        onClick={() => setActiveStore(store.id)}
                        className="relative group/pin focus:outline-none"
                    >
                        {/* Pin Head */}
                        <div className={cn(
                            "flex items-center justify-center rounded-full shadow-lg border-2 transition-all duration-300",
                            isActive 
                                ? "w-8 h-8 bg-primary-pink border-white text-white z-20 scale-110 shadow-[0_0_15px_-3px_rgba(236,72,153,0.6)]" 
                                : "w-6 h-6 bg-dark-elevated border-primary-purple text-primary-purple hover:scale-110 hover:border-white hover:text-white"
                        )}>
                            <Store size={isActive ? 14 : 12} />
                        </div>

                        {/* Ripple Effect for active pin */}
                        {isActive && (
                            <div className="absolute inset-0 rounded-full border border-primary-pink animate-ping" />
                        )}

                        {/* Tooltip / Price Tag */}
                        <div className={cn(
                            "absolute left-1/2 -translate-x-1/2 transition-all duration-200 pointer-events-none z-30",
                            isActive ? "-top-10 opacity-100 scale-100" : "-top-8 opacity-0 scale-90 group-hover/pin:opacity-100 group-hover/pin:scale-100"
                        )}>
                            <div className="bg-black/90 text-white text-[10px] font-bold px-2 py-1 rounded border border-white/10 whitespace-nowrap shadow-xl flex flex-col items-center">
                                <span>{formatCurrency(store.price)}</span>
                                <div className="absolute -bottom-1 w-2 h-2 bg-black/90 border-b border-r border-white/10 rotate-45" />
                            </div>
                        </div>
                    </button>
                </div>
            )
        })}

        {/* Info Overlay for Active Store */}
        <AnimatePresence>
            {activeStore && (() => {
                const store = stores.find(s => s.id === activeStore);
                if (!store) return null;
                return (
                    <motion.div 
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        className="absolute bottom-4 left-4 right-4 z-20"
                    >
                        <div className="bg-dark-card/95 backdrop-blur-md p-3 rounded-xl border border-primary-purple/30 shadow-2xl flex items-center justify-between">
                            <div className="flex-1 min-w-0 mr-3">
                                <h4 className="text-xs font-bold text-white truncate">{store.name}</h4>
                                <p className="text-[10px] text-text-muted truncate flex items-center gap-1">
                                    <MapPin size={9} /> {store.address}
                                </p>
                            </div>
                            <a 
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.name + ' ' + store.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-primary-purple to-primary-pink hover:opacity-90 text-white rounded-lg text-[11px] font-bold transition-all shadow-lg"
                            >
                                <Navigation size={12} /> 
                                Navigate
                            </a>
                        </div>
                    </motion.div>
                );
            })()}
        </AnimatePresence>

        {/* Map Control Simulators */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
            <div className="w-8 h-8 rounded-lg bg-dark-card/80 border border-dark-border flex items-center justify-center text-text-secondary hover:text-white hover:bg-dark-elevated transition-colors cursor-default">
                <Target size={14} />
            </div>
            <div className="w-8 h-8 rounded-lg bg-dark-card/80 border border-dark-border flex items-center justify-center text-text-secondary hover:text-white hover:bg-dark-elevated transition-colors cursor-default">
                <Scan size={14} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default MapWidget;
