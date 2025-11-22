import React from 'react';
import { motion } from 'framer-motion';
import { ActionTabs } from './ActionTabs';

interface CalendarEventData {
  title: string;
  location?: string;
  startDate: string;
  startTime: string;
  endTime: string;
  invitees?: string[];
}

interface MapPlace {
  name: string;
  description: string;
  rating: number;
  distance?: string;
}

interface EnhancedMessageProps {
  type: 'calendar' | 'maps' | 'action' | 'default';
  content?: string;
  calendarEvent?: CalendarEventData;
  mapPlaces?: MapPlace[];
  actionOptions?: Array<{
    id: string;
    icon?: string; // Icon name or emoji
    label: string;
    description?: string;
  }>;
  onActionSelect?: (optionId: string) => void;
}

export const EnhancedMessage: React.FC<EnhancedMessageProps> = ({
  type,
  content,
  calendarEvent,
  mapPlaces,
  actionOptions,
  onActionSelect,
}) => {
  if (type === 'calendar' && calendarEvent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="my-3"
      >
        {/* User Query */}
        {content && (
          <div className="text-[15px] text-gray-700 font-medium mb-3">
            {content}
          </div>
        )}

        {/* Calendar Icon with Checkmark */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-red-500 flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[15px] font-semibold text-gray-900">Add Event</span>
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Event Details with Timeline */}
        <div className="flex gap-4">
          {/* Left: Event Details */}
          <div className="flex-1 space-y-2">
            <div className="text-[17px] font-semibold text-gray-900">
              {calendarEvent.title}
            </div>
            
            {calendarEvent.location && (
              <div className="text-[15px] text-gray-700">
                <span className="text-gray-500">Location:</span> {calendarEvent.location}
              </div>
            )}

            <div className="text-[15px] text-gray-500">
              All Day: <span className="inline-block w-4 h-4 rounded bg-gray-300 align-middle"></span>
            </div>

            <div className="text-[15px] text-gray-900">
              <span className="text-gray-700">Starts:</span> {calendarEvent.startDate} {calendarEvent.startTime}
            </div>

            <div className="text-[15px] text-gray-900">
              <span className="text-gray-700">Ends:</span> {calendarEvent.startDate} {calendarEvent.endTime}
            </div>

            {calendarEvent.invitees && calendarEvent.invitees.length > 0 && (
              <div className="text-[15px] text-gray-700">
                <span className="text-gray-500">Invitees:</span> {calendarEvent.invitees.join(', ')}
              </div>
            )}
          </div>

          {/* Right: Timeline */}
          <div className="w-32 flex flex-col text-[13px] text-gray-600 border-l border-gray-200 pl-3">
            {[
              { time: calendarEvent.startTime.split(':')[0] + ' PM', highlight: false },
              { time: parseInt(calendarEvent.startTime.split(':')[0]) + 1 + ' PM', highlight: true },
              { time: parseInt(calendarEvent.startTime.split(':')[0]) + 2 + ' PM', highlight: false },
              { time: parseInt(calendarEvent.startTime.split(':')[0]) + 3 + ' PM', highlight: false },
            ].map((slot, idx) => (
              <div key={idx} className="flex items-center gap-2 py-1.5">
                <div className="w-16">{slot.time}</div>
                {slot.highlight && (
                  <div className="flex-1 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <div className="text-[12px] font-medium text-gray-900 truncate">
                      {calendarEvent.title}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (type === 'maps' && mapPlaces) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="my-3"
      >
        {/* User Query */}
        {content && (
          <div className="text-[15px] text-gray-700 font-medium mb-3">
            {content}
          </div>
        )}

        {/* Maps Icon with Checkmark */}
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <div className="flex items-center gap-1.5">
            <span className="text-[15px] font-medium text-gray-900">Search Maps</span>
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Places List */}
        <div className="space-y-1 text-[15px]">
          <div className="text-gray-900 font-medium mb-2">
            Here are some great bars near Mijote:
          </div>
          
          <ul className="space-y-1">
            {mapPlaces.map((place, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-gray-600 mt-0.5">-</span>
                <div>
                  <a
                    href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(place.name + ' ' + place.description)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-900 font-medium underline hover:text-blue-600 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      if (window.electronAPI?.openExternal) {
                        window.electronAPI.openExternal(`https://www.openstreetmap.org/search?query=${encodeURIComponent(place.name + ' ' + place.description)}`);
                      }
                    }}
                  >
                    {place.name}
                  </a>
                  <span className="text-gray-700"> — {place.description}, </span>
                  <span className="text-gray-700">{place.rating} </span>
                  <span className="text-yellow-500">★</span>
                </div>
              </li>
            ))}
          </ul>

          <div className="text-gray-700 mt-3">
            All are under a 5-minute walk. Trick Dog or True Laurel are both especially popular and close!
          </div>
        </div>
      </motion.div>
    );
  }

  if (type === 'action' && actionOptions && onActionSelect) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="my-3"
      >
        <div className="text-[15px] text-gray-900 font-medium mb-3">
          What would you like me to do with this image?
        </div>
        <ActionTabs options={actionOptions} onSelect={onActionSelect} />
      </motion.div>
    );
  }

  return null;
};
