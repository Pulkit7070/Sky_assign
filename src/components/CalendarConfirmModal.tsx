import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParsedEvent } from '../services/nlp-parser';

interface CalendarConfirmModalProps {
  isOpen: boolean;
  parsedEvent: ParsedEvent | null;
  onConfirm: () => void;
  onCancel: () => void;
  isCreating?: boolean;
}

export const CalendarConfirmModal: React.FC<CalendarConfirmModalProps> = ({
  isOpen,
  parsedEvent,
  onConfirm,
  onCancel,
  isCreating = false,
}) => {
  if (!parsedEvent || !parsedEvent.isValid) return null;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={isCreating ? undefined : onCancel}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[360px]"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden">
              {/* Header */}
              <div className="px-5 py-4 border-b border-gray-200/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Create Calendar Event
                  </h3>
                  <button
                    onClick={onCancel}
                    disabled={isCreating}
                    className="w-5 h-5 rounded-full bg-gray-200/80 hover:bg-gray-300 transition-colors flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="w-3 h-3 text-gray-600 group-hover:text-gray-800"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-5 py-4 space-y-3">
                {/* Event Title */}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Event
                  </label>
                  <p className="mt-1 text-sm text-gray-900 font-medium">
                    {parsedEvent.title}
                  </p>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Starts
                    </label>
                    <p className="mt-1 text-xs text-gray-700">
                      {formatDate(parsedEvent.startDateTime)}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Ends
                    </label>
                    <p className="mt-1 text-xs text-gray-700">
                      {formatDate(parsedEvent.endDateTime)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-200/50 flex gap-2">
                <button
                  onClick={onCancel}
                  disabled={isCreating}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isCreating}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Creating...</span>
                    </>
                  ) : (
                    'Create Event'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
