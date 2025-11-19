import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { Action } from '@/types';

export const ActionTabs: React.FC = () => {
  const { actions, updateAction } = useAppStore();

  const handleActionClick = (action: Action) => {
    if (action.state === 'loading') return;

    // Simulate action execution
    updateAction(action.id, { state: 'loading' });

    setTimeout(() => {
      updateAction(action.id, { state: 'completed' });
      
      // Reset after 2 seconds
      setTimeout(() => {
        updateAction(action.id, { state: 'ready' });
      }, 2000);
    }, 1500);
  };

  const getActionIcon = (action: Action) => {
    if (action.state === 'loading') {
      return (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-4 h-4 border-2 border-sky-accent border-t-transparent rounded-full"
        />
      );
    }

    if (action.state === 'completed') {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 text-green-500"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      );
    }

    if (action.state === 'error') {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 text-red-500"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      );
    }

    return null;
  };

  return (
    <div className="border-t border-sky-border/30 bg-gradient-to-b from-white/70 via-white/60 to-white/50 backdrop-blur-2xl relative">
      {/* Subtle top highlight */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      
      <div className="flex items-center gap-2.5 px-5 py-3.5 overflow-x-auto scrollbar-hide">
        {actions.map((action) => (
          <motion.button
            key={action.id}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleActionClick(action)}
            disabled={action.state === 'loading'}
            className={`flex-shrink-0 flex items-center gap-2 px-5 py-2 rounded-lg text-[11px] font-semibold tracking-wide transition-all relative overflow-hidden ${
              action.state === 'ready'
                ? 'bg-white/90 text-sky-accent border border-sky-accent/25 shadow-sm hover:shadow-md hover:border-sky-accent/40 hover:bg-white'
                : action.state === 'loading'
                ? 'bg-white/70 text-sky-text-secondary cursor-wait border border-sky-border/20'
                : action.state === 'completed'
                ? 'bg-white/90 text-sky-success border border-sky-success/30 shadow-sm'
                : 'bg-white/90 text-sky-error border border-sky-error/30 shadow-sm'
            }`}
          >
            {/* Subtle gradient overlay for depth */}
            {action.state === 'ready' && (
              <div className="absolute inset-0 bg-gradient-to-br from-sky-accent/5 to-transparent pointer-events-none" />
            )}
            
            <div className="relative z-10 flex items-center gap-2">
              {getActionIcon(action)}
              <span className="uppercase">{action.label}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
