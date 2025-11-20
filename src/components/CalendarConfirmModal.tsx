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
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-end justify-center pb-32 px-6 z-[9999] pointer-events-none"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md pointer-events-auto"
            onClick={isCreating ? undefined : onCancel}
          />

          {/* Modal - Compact version below input */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-[600px] bg-white/10 dark:bg-white/5 backdrop-blur-[50px] rounded-[24px] shadow-2xl border border-white/20 dark:border-white/10 overflow-visible pointer-events-auto"
          >
            {/* Mac-style close button */}
            {!isCreating && (
              <button
                onClick={onCancel}
                className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-[#FF5F57] hover:bg-[#FF5F57]/80 transition-all z-10 shadow-lg flex items-center justify-center"
                aria-label="Close"
              >
                <svg className="w-2.5 h-2.5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            <div className="p-6">
              {/* Header with Icon */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 dark:from-blue-400/10 dark:to-purple-400/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl">📅</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Create Calendar Event
                  </h2>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Review and confirm to add to Google Calendar
                  </p>
                </div>
              </div>

              {/* Event Details - Horizontal Cards */}
              <div className="space-y-3 mb-5">
                {/* Event Title */}
                <div className="bg-white/10 dark:bg-white/5 rounded-xl p-3 border border-white/10 dark:border-white/5">
                  <div className="text-[10px] text-gray-500 dark:text-gray-500 mb-1 uppercase tracking-wide font-medium">
                    EVENT
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {parsedEvent.title}
                  </div>
                </div>

                {/* Date & Time in one row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 dark:bg-white/5 rounded-xl p-3 border border-white/10 dark:border-white/5">
                    <div className="text-[10px] text-gray-500 dark:text-gray-500 mb-1 uppercase tracking-wide font-medium">
                      DATE
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatDate(parsedEvent.startDateTime)}
                    </div>
                  </div>
                  <div className="bg-white/10 dark:bg-white/5 rounded-xl p-3 border border-white/10 dark:border-white/5">
                    <div className="text-[10px] text-gray-500 dark:text-gray-500 mb-1 uppercase tracking-wide font-medium">
                      TIME
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatTime(parsedEvent.startDateTime)} - {formatTime(parsedEvent.endDateTime)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  disabled={isCreating}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 border border-white/20 dark:border-white/10 text-gray-700 dark:text-gray-300 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isCreating}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-medium transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Event'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
