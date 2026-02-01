import React from 'react';
import { AgentStep } from '../../types';
import { motion } from 'framer-motion';
import { Search, BrainCircuit, MessageSquare } from 'lucide-react';

interface AgentStatusProps {
  step: AgentStep | null;
}

const AgentStatus: React.FC<AgentStatusProps> = ({ step }) => {
  if (!step) return null;

  const getIcon = (title: string) => {
    if (title.includes('Analyzing')) return <BrainCircuit className="h-4 w-4 text-primary-purple" />;
    if (title.includes('Researching')) return <Search className="h-4 w-4 text-primary-pink" />;
    return <MessageSquare className="h-4 w-4 text-white" />;
  };

  return (
    <div className="flex justify-center w-full my-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="flex items-center gap-3 bg-dark-elevated border border-dark-border px-4 py-2 rounded-full shadow-lg"
      >
        <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-purple opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-purple"></span>
        </span>
        <div className="flex items-center gap-2 text-xs font-medium text-white">
            {getIcon(step.title)}
            <span>{step.title}</span>
        </div>
      </motion.div>
    </div>
  );
};

export default AgentStatus;