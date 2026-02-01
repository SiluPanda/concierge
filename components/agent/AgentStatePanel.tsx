import React from 'react';
import { AgentState, AgentPhase } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, 
  Search, 
  MessagesSquare, 
  UserCheck, 
  Database, 
  Sparkles,
  CheckCircle2,
  ListFilter
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface AgentStatePanelProps {
  state: AgentState;
  minimal?: boolean;
}

const PHASE_CONFIG: Record<AgentPhase, { label: string; icon: React.ReactNode; color: string }> = {
  idle: { label: 'Ready', icon: <Sparkles size={14} />, color: 'text-text-secondary' },
  load_preferences: { label: 'Loading Profile', icon: <UserCheck size={14} />, color: 'text-indigo-400' },
  detecting: { label: 'Detecting Category', icon: <BrainCircuit size={14} />, color: 'text-primary-purple' },
  clarifying: { label: 'Asking Questions', icon: <MessagesSquare size={14} />, color: 'text-primary-pink' },
  extracting: { label: 'Extracting Answers', icon: <ListFilter size={14} />, color: 'text-blue-400' },
  searching: { label: 'Discovering Products', icon: <Search size={14} />, color: 'text-blue-400' },
  presenting: { label: 'Presenting Results', icon: <Sparkles size={14} />, color: 'text-emerald-400' },
  complete: { label: 'Complete', icon: <CheckCircle2 size={14} />, color: 'text-emerald-500' },
};

const AgentStatePanel: React.FC<AgentStatePanelProps> = ({ state, minimal = false }) => {
  if (state.phase === 'idle' && !minimal) return null;

  const config = PHASE_CONFIG[state.phase] || PHASE_CONFIG.idle;

  return (
    <div className={cn("w-full flex justify-center", minimal ? "my-0" : "my-4")}>
      <AnimatePresence mode="wait">
        <motion.div
          key={state.phase}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "flex items-center gap-3 bg-dark-elevated border border-dark-border rounded-full shadow-lg backdrop-blur-md",
            minimal ? "px-3 py-1.5" : "px-4 py-2"
          )}
        >
          {state.isLive && (
            <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-purple opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-purple"></span>
            </span>
          )}
          
          <div className={cn("flex items-center gap-2 font-medium text-white", minimal ? "text-[11px]" : "text-xs")}>
             <span className={cn(config.color)}>{config.icon}</span>
             <span>{config.label}</span>
          </div>

          {!minimal && state.confidence > 0 && (
            <div className="flex items-center gap-1 pl-2 border-l border-white/10 ml-1">
              <span className="text-[10px] text-text-muted">Confidence</span>
              <span className="text-[10px] font-bold text-emerald-400">{state.confidence}%</span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AgentStatePanel;