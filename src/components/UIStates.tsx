import React from 'react';
import { motion } from 'framer-motion';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="space-y-2"
        >
          <div className="h-4 bg-gray-200 rounded-lg w-3/4 skeleton" />
          <div className="h-4 bg-gray-200 rounded-lg w-1/2 skeleton" />
        </motion.div>
      ))}
    </div>
  );
};

export const EmptyState: React.FC<{
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}> = ({ icon = '📭', title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-sky-text mb-2">{title}</h3>
      {description && (
        <p className="text-sky-text-secondary text-sm mb-4 max-w-sm">{description}</p>
      )}
      {action && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={action.onClick}
          className="px-6 py-2 bg-sky-accent text-white rounded-lg hover:bg-sky-accent/90 transition-colors"
        >
          {action.label}
        </motion.button>
      )}
    </div>
  );
};

export const ErrorState: React.FC<{
  message: string;
  onRetry?: () => void;
}> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="text-6xl mb-4">⚠️</div>
      <h3 className="text-lg font-semibold text-red-600 mb-2">Error</h3>
      <p className="text-sky-text-secondary text-sm mb-4 max-w-sm">{message}</p>
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="px-6 py-2 bg-sky-accent text-white rounded-lg hover:bg-sky-accent/90 transition-colors"
        >
          Try Again
        </motion.button>
      )}
    </div>
  );
};
