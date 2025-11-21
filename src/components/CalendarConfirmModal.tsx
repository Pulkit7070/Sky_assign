import React, { useState } from 'react';
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
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Editable state for event details
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [isAllDay, setIsAllDay] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [invitees, setInvitees] = useState('');

  // Initialize state when parsedEvent changes
  React.useEffect(() => {
    if (parsedEvent && parsedEvent.isValid) {
      setTitle(parsedEvent.title);
      setLocation('');
      setIsAllDay(false);
      
      // Format dates for input fields
      const formatDateForInput = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      
      const formatTimeForInput = (date: Date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
      };
      
      setStartDate(formatDateForInput(parsedEvent.startDateTime));
      setStartTime(formatTimeForInput(parsedEvent.startDateTime));
      setEndDate(formatDateForInput(parsedEvent.endDateTime));
      setEndTime(formatTimeForInput(parsedEvent.endDateTime));
      setInvitees('');
    }
  }, [parsedEvent]);

  // Resize window when expanding/collapsing additional fields
  React.useEffect(() => {
    if (isOpen && window.electronAPI?.requestResize) {
      const windowHeight = isExpanded ? 780 : 720;
      window.electronAPI.requestResize({ 
        width: 650, 
        height: windowHeight, 
        anchor: 'center' 
      });
    }
  }, [isExpanded]);

  if (!parsedEvent || !parsedEvent.isValid) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  const getTimeRange = () => {
    if (!startDate || !startTime || !endDate || !endTime) return '';
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    const diffMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    if (hours > 0 && minutes > 0) {
      return `${hours} hr ${minutes} min`;
    } else if (hours > 0) {
      return `${hours} hr`;
    } else {
      return `${minutes} min`;
    }
  };

  const handleConfirm = () => {
    // Update parsedEvent with edited values before confirming
    if (parsedEvent) {
      parsedEvent.title = title;
      parsedEvent.startDateTime = new Date(`${startDate}T${startTime}`);
      parsedEvent.endDateTime = new Date(`${endDate}T${endTime}`);
    }
    onConfirm();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              if (!isCreating) onCancel();
            }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            style={{ zIndex: 9999, pointerEvents: 'auto' }}
          />
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none p-4" style={{ zIndex: 10000 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto w-full max-w-[440px] bg-white rounded-xl shadow-2xl overflow-hidden"
              style={{ position: 'relative', zIndex: 10001 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                <button
                  onClick={onCancel}
                  disabled={isCreating}
                  className="text-[15px] text-blue-500 hover:text-blue-600 font-normal disabled:opacity-50"
                >
                  Cancel
                </button>
                <h3 className="text-[17px] font-semibold text-gray-900">
                  New Event
                </h3>
                <button
                  onClick={handleConfirm}
                  disabled={isCreating}
                  className="text-[15px] text-blue-500 hover:text-blue-600 font-semibold disabled:opacity-50"
                >
                  {isCreating ? 'Adding...' : 'Add'}
                </button>
              </div>

              {/* Form Content */}
              <div className="px-5 py-4 space-y-4">
                {/* Title Input */}
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <div className="w-20 text-[15px] text-gray-600">Title</div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="flex-1 text-[15px] text-gray-900 bg-transparent border-none outline-none placeholder-gray-400"
                    placeholder="Event name"
                  />
                </div>

                {/* Location Input */}
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <div className="w-20 text-[15px] text-gray-600">Location</div>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="flex-1 text-[15px] text-gray-900 bg-transparent border-none outline-none placeholder-gray-400"
                    placeholder="Add location"
                  />
                </div>

                {/* All-day toggle */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <div className="text-[15px] text-gray-900">All-day</div>
                  <label className="relative inline-block w-12 h-7">
                    <input 
                      type="checkbox" 
                      checked={isAllDay}
                      onChange={(e) => setIsAllDay(e.target.checked)}
                      className="peer sr-only" 
                    />
                    <div className="w-12 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>

                {/* Start Date/Time */}
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <div className="w-20 text-[15px] text-gray-600">Starts</div>
                  <div className="flex-1 flex items-center gap-3">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="text-[15px] text-gray-900 bg-transparent border-none outline-none cursor-pointer"
                    />
                    {!isAllDay && (
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="text-[15px] text-blue-500 bg-transparent border-none outline-none cursor-pointer"
                      />
                    )}
                  </div>
                </div>

                {/* End Date/Time */}
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <div className="w-20 text-[15px] text-gray-600">Ends</div>
                  <div className="flex-1 flex items-center gap-3">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="text-[15px] text-gray-900 bg-transparent border-none outline-none cursor-pointer"
                    />
                    {!isAllDay && (
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="text-[15px] text-blue-500 bg-transparent border-none outline-none cursor-pointer"
                      />
                    )}
                  </div>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <div className="w-20 text-[15px] text-gray-600">Duration</div>
                  <div className="text-[15px] text-gray-400">
                    {getTimeRange()}
                  </div>
                </div>

                {/* Calendar Selection */}
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <div className="w-20 text-[15px] text-gray-600">Calendar</div>
                  <div className="flex-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div className="text-[15px] text-gray-900">Personal</div>
                    </div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Invitees */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-center gap-3 pb-3 border-b border-gray-200"
                  >
                    <div className="w-20 text-[15px] text-gray-600">Invitees</div>
                    <input
                      type="text"
                      value={invitees}
                      onChange={(e) => setInvitees(e.target.value)}
                      className="flex-1 text-[15px] text-gray-900 bg-transparent border-none outline-none placeholder-gray-400"
                      placeholder="Add people"
                    />
                  </motion.div>
                )}

                {/* Show More/Less Toggle */}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-full flex items-center justify-center gap-1 py-2 text-[15px] text-blue-500 hover:text-blue-600"
                >
                  <span>{isExpanded ? 'Show Less' : 'Show More'}</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
