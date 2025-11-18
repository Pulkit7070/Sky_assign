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
    <div className="border-t border-sky-border bg-white/40 backdrop-blur-md">
      <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
        {actions.map((action) => (
          <motion.button
            key={action.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleActionClick(action)}
            disabled={action.state === 'loading'}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-colors ${
              action.state === 'ready'
                ? 'bg-sky-accent/10 text-sky-accent hover:bg-sky-accent/20'
                : action.state === 'loading'
                ? 'bg-gray-100 text-gray-400 cursor-wait'
                : action.state === 'completed'
                ? 'bg-green-50 text-green-600'
                : 'bg-red-50 text-red-600'
            }`}
          >
            {getActionIcon(action)}
            <span>{action.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
