import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ActionOption {
  id: string;
  label: string;
  description?: string;
}

interface ActionTabsProps {
  options: ActionOption[];
  onSelect: (optionId: string) => void;
  selectedId?: string | null;
}

export const ActionTabs: React.FC<ActionTabsProps> = ({ options, onSelect, selectedId }) => {
  const handleSelect = (id: string) => {
    onSelect(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-2 my-3"
    >
      {options.map((option) => {
        return (
          <motion.button
            key={option.id}
            onClick={() => handleSelect(option.id)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all bg-white/70 border border-gray-200/40 hover:bg-white/85"
          >
            {/* Label */}
            <div className="flex-1 text-left">
              <div className="text-[15px] font-medium text-gray-700">
                {option.label}
              </div>
              {option.description && (
                <div className="text-[13px] text-gray-500 mt-0.5">
                  {option.description}
                </div>
              )}
            </div>

            {/* Arrow */}
            <div className="shrink-0">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  );
};
