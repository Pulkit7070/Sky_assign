import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { ConversationList } from './ConversationList';
import { MessageInput } from './MessageInput';
import { ChatMessage } from './ChatMessage';
import { ActionTabs } from './ActionTabs';
import { CalendarConfirmModal } from './CalendarConfirmModal';
import { NLPParser, ParsedEvent } from '../services/nlp-parser';
import { sendMessageToGemini, isGeminiAvailable } from '../services/gemini-service';

export const ExpandedWindow: React.FC = () => {
  const {
    getCurrentConversation,
    addConversation,
    addMessage,
    updateMessage,
    currentConversationId,
    clearCurrentConversation,
  } = useAppStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = React.useState(false);
  const [parsedCalendarEvent, setParsedCalendarEvent] = React.useState<ParsedEvent | null>(null);
  const [isCreatingEvent, setIsCreatingEvent] = React.useState(false);
  const [isCalendarInitialized, setIsCalendarInitialized] = React.useState(false);
  const currentConversation = getCurrentConversation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

  useEffect(() => {
    if (!window.electronAPI?.onRefresh) return;
    
    return window.electronAPI.onRefresh(() => {
      setIsRefreshing(true);
      setTimeout(() => setIsRefreshing(false), 500);
    });
  }, []);

  // Initialize Google Calendar on mount
  useEffect(() => {
    const initCalendar = async () => {
      try {
        if (!window.electronAPI?.calendar) {
          setIsCalendarInitialized(true);
          return;
        }
        
        const result = await window.electronAPI.calendar.initialize();
        
        if (result.success) {
          setIsCalendarInitialized(true);
        } else {
          setIsCalendarInitialized(true);
        }
      } catch (error) {
        setIsCalendarInitialized(true);
      }
    };
    
    initCalendar();

    const handleAuthSuccess = () => {
      addMessage(currentConversationId || '', {
        role: 'assistant',
        content: 'Successfully connected to Google Calendar. You can now create events.',
        status: 'sent',
      });
      
      if (parsedCalendarEvent && isCalendarModalOpen) {
        handleCalendarConfirm();
      }
    };

    const handleAuthError = (error: any) => {
      addMessage(currentConversationId || '', {
        role: 'assistant',
        content: `Authentication failed: ${error.message || 'Unknown error'}`,
        status: 'sent',
      });
    };

    if (window.electronAPI?.onCalendarAuthSuccess) {
      const unsubSuccess = window.electronAPI.onCalendarAuthSuccess(handleAuthSuccess);
      const unsubError = window.electronAPI.onCalendarAuthError?.(handleAuthError);
      
      return () => {
        unsubSuccess?.();
        unsubError?.();
      };
    }
  }, [parsedCalendarEvent, isCalendarModalOpen]);

  const handleCalendarConfirm = async () => {
    if (!parsedCalendarEvent) {
      return;
    }

    setIsCreatingEvent(true);

    try {
      const authCheck = await window.electronAPI.calendar.checkAuth();
      
      if (!authCheck.authenticated) {
        const authResult = await window.electronAPI.calendar.authenticate();
        
        if (!authResult.success) {
          throw new Error(authResult.error || 'Authentication failed');
        }

        addMessage(currentConversationId!, {
          role: 'assistant',
          content: 'Authentication window opened. Please complete the login and try creating the event again.',
          status: 'sent',
        });

        setIsCalendarModalOpen(false);
        setIsCreatingEvent(false);
        return;
      }

      const result = await window.electronAPI.calendar.createEvent({
        summary: parsedCalendarEvent.title,
        startDateTime: parsedCalendarEvent.startDateTime.toISOString(),
        endDateTime: parsedCalendarEvent.endDateTime.toISOString(),
      });

      if (result.success) {
        const successMessage = result.eventLink
          ? `Event created successfully.\n\n**${parsedCalendarEvent.title}**\n${parsedCalendarEvent.startDateTime.toLocaleString()}\n\n[View in Google Calendar](${result.eventLink})`
          : `Event "${parsedCalendarEvent.title}" created successfully.`;

        addMessage(currentConversationId!, {
          role: 'assistant',
          content: successMessage,
          status: 'sent',
        });
      } else {
        throw new Error(result.error || 'Failed to create event');
      }
    } catch (error: any) {
      addMessage(currentConversationId!, {
        role: 'assistant',
        content: `Failed to create event: ${error.message}`,
        status: 'sent',
      });
    } finally {
      setIsCalendarModalOpen(false);
      setIsCreatingEvent(false);
      setParsedCalendarEvent(null);
    }
  };

  const handleCalendarCancel = () => {
    setIsCalendarModalOpen(false);
    setParsedCalendarEvent(null);
  };

  const handleSendMessage = async (content: string) => {
    let conversationId = currentConversationId;

    // Create new conversation if none exists
    if (!conversationId) {
      conversationId = addConversation();
    }

    // PRIORITY 1: Check if message is a location/places intent (check BEFORE calendar and Gemini)
    const isLocationMessage = NLPParser.isLocationIntent(content);
    
    if (isLocationMessage && window.electronAPI?.places) {
      const locationQuery = NLPParser.parseLocationQuery(content);
      
      if (locationQuery.isValid) {
        // Add user message
        addMessage(conversationId, {
          role: 'user',
          content,
          status: 'sent',
        });

        // Add loading message
        addMessage(conversationId, {
          role: 'assistant',
          content: 'Searching for nearby places...',
          status: 'sending',
        } as any);

        const messages = getCurrentConversation()?.messages || [];
        const loadingMessage = messages[messages.length - 1];
        const loadingMessageId = loadingMessage?.id;

        try {
          let placesResult;
          
          if (locationQuery.type === 'nearby' && locationQuery.useCurrentLocation) {
            // Get current location - try browser geolocation first, then IP fallback
            let location: { lat: number; lng: number } | null = null;
            
            try {
              // Try browser geolocation first
              const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                  resolve,
                  reject,
                  {
                    enableHighAccuracy: false,
                    timeout: 5000,
                    maximumAge: 300000 // 5 minutes cache
                  }
                );
              });

              location = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
            } catch (geoError: any) {
              // Fallback to IP-based geolocation (free, no API key)
              const ipLocation = await window.electronAPI.places.getLocationFromIP();
              
              if (ipLocation.success && ipLocation.location) {
                location = {
                  lat: ipLocation.location.lat,
                  lng: ipLocation.location.lng,
                };
                
                // Update loading message to show we're using approximate location
                updateMessage(conversationId, loadingMessageId, {
                  content: `Using approximate location (${ipLocation.location.city}, ${ipLocation.location.country})...\nSearching for nearby places...`,
                  status: 'sending',
                });
              } else {
                // Both methods failed
                updateMessage(conversationId, loadingMessageId, {
                  content: `Unable to determine your location.\n\n` +
                    `**Try searching with a specific location instead:**\n` +
                    `For example: "Find restaurants in New York" or "Coffee shops in Delhi"`,
                  status: 'sent',
                });
                return;
              }
            }

            if (location) {
              placesResult = await window.electronAPI.places.searchNearby({
                location,
                radius: 5000, // 5km default
                type: locationQuery.placeType,
                keyword: locationQuery.keyword,
              });
            }
          } else if (locationQuery.type === 'text') {
            // Text search with location name
            placesResult = await window.electronAPI.places.searchText({
              query: locationQuery.location 
                ? `${locationQuery.keyword || locationQuery.placeType} in ${locationQuery.location}`
                : content,
            });
          }

          if (placesResult?.success && placesResult.results && placesResult.results.length > 0) {
            // Format OSM results for display
            const formattedResults = placesResult.results.slice(0, 5).map((place: any, index: number) => {
              const distance = place.distance ? `📍 ${(place.distance / 1000).toFixed(1)}km away` : '';
              const type = place.type ? `(${place.type})` : '';
              const address = place.address || '';
              
              return `${index + 1}. **${place.name}** ${type}\n   ${address}\n   ${distance}`.trim();
            }).join('\n\n');

            const resultText = `I found ${placesResult.results.length} places:\n\n${formattedResults}\n\n_Map data © OpenStreetMap contributors_`;

            updateMessage(conversationId, loadingMessageId, {
              content: resultText,
              status: 'sent',
            });
          } else {
            updateMessage(conversationId, loadingMessageId, {
              content: placesResult?.error || 'No places found matching your criteria.',
              status: 'sent',
            });
          }
        } catch (error: any) {
          updateMessage(conversationId, loadingMessageId, {
            content: error.message === 'User denied Geolocation'
              ? 'Location access denied. Please enable location permissions to search nearby places.'
              : `Failed to search places: ${error.message}`,
            status: 'error',
          });
        }
        
        return; // Stop here, don't send to Gemini
      }
    }

    // PRIORITY 2: Check if message is a calendar intent
    const isCalendarMessage = NLPParser.isCalendarIntent(content);
    
    if (isCalendarInitialized && isCalendarMessage) {
      const parsedEvent = NLPParser.parseEventFromText(content);
      
      if (parsedEvent.isValid) {
        // Add user message
        addMessage(conversationId, {
          role: 'user',
          content,
          status: 'sent',
        });

        // Show calendar confirmation modal
        setParsedCalendarEvent(parsedEvent);
        setIsCalendarModalOpen(true);
        return;
      }
    }

    // PRIORITY 3: Send to Gemini (if not location or calendar)
    // Add user message
    addMessage(conversationId, {
      role: 'user',
      content,
      status: 'sent',
    });

    // Add placeholder assistant message and store its ID for updates
    const tempId = `temp-${Date.now()}`;
    addMessage(conversationId, {
      role: 'assistant',
      content: 'Thinking...',
      status: 'sending',
    } as any);

    // Get the actual ID of the just-added message
    const messages = getCurrentConversation()?.messages || [];
    const placeholderMessage = messages[messages.length - 1];
    const placeholderId = placeholderMessage?.id;

    // Check if Gemini is available
    if (!isGeminiAvailable()) {
      updateMessage(conversationId, placeholderId, {
        content: 'Gemini API is not configured. Please add your GEMINI_API_KEY to the .env file.',
        status: 'error',
      });
      return;
    }

    try {
      // Get conversation history for context (last 6 messages)
      const currentMessages = getCurrentConversation()?.messages || [];
      const history = currentMessages.slice(-6).map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Call Gemini API
      const geminiResponse = await sendMessageToGemini(content, history);

      if (geminiResponse.error) {
        updateMessage(conversationId, placeholderId, {
          content: `Error: ${geminiResponse.error}`,
          status: 'error',
        });
        return;
      }

      if (!geminiResponse.text || geminiResponse.text.trim() === '') {
        updateMessage(conversationId, placeholderId, {
          content: 'Received an empty response from the AI. Please try again.',
          status: 'error',
        });
        return;
      }

      // Success - update placeholder with actual response
      updateMessage(conversationId, placeholderId, {
        content: geminiResponse.text,
        status: 'sent',
      });
    } catch (error: any) {
      updateMessage(conversationId, placeholderId, {
        content: `Failed to get AI response: ${error.message || 'Unknown error'}`,
        status: 'error',
      });
    }
  };

  const handleCollapse = async () => {
    if (window.electronAPI) {
      await window.electronAPI.toggleWindowMode('compact');
    }
  };

  const messages = currentConversation?.messages || [];
  const isEmpty = messages.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 20 }}
      animate={{ 
        opacity: isRefreshing ? 0.6 : 1, 
        scale: isRefreshing ? 0.99 : 1, 
        y: 0 
      }}
      transition={{ 
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1]
      }}
      className="h-full flex bg-linear-to-br from-sky-bg/95 via-sky-bg-secondary/90 to-sky-bg/95 backdrop-blur-2xl rounded-sky-xl border border-sky-border/60 shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-clip relative"
    >
      {/* Refresh overlay animation */}
      <AnimatePresence>
        {isRefreshing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-sky-accent/10 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.6, ease: "linear", repeat: Infinity }}
              className="text-sky-accent"
            >
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-accent-light/5 via-transparent to-sky-purple/5 pointer-events-none" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-sky-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-purple/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Sidebar */}
      <ConversationList />

      {/* Main content */}
      <div className="flex-1 flex flex-col relative">
        {/* Header with macOS traffic lights style */}
        <div
          className="flex-shrink-0 h-14 flex items-center justify-between px-6 border-b border-sky-divider/30 bg-linear-to-b from-white/60 via-white/40 to-transparent backdrop-blur-md relative z-10 rounded-tr-sky-xl"
          style={{ WebkitAppRegion: 'drag' } as any}
        >
          <div className="flex items-center gap-2">
            {/* macOS Traffic Light Buttons */}
            <motion.button
              whileHover={{ scale: 1.15, boxShadow: '0 0 12px rgba(255, 59, 48, 0.4)' }}
              whileTap={{ scale: 0.85 }}
              onClick={() => window.electronAPI?.closeWindow()}
              className="w-3 h-3 rounded-full bg-sky-error shadow-inner relative group transition-all duration-200"
              style={{ WebkitAppRegion: 'no-drag' } as any}
              title="Close"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <svg className="w-1.5 h-1.5 text-red-900" fill="none" viewBox="0 0 12 12">
                  <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M3 3l6 6M9 3l-6 6" />
                </svg>
              </div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.15, boxShadow: '0 0 12px rgba(255, 157, 0, 0.4)' }}
              whileTap={{ scale: 0.85 }}
              onClick={handleCollapse}
              className="w-3 h-3 rounded-full bg-sky-warning shadow-inner relative group transition-all duration-200"
              style={{ WebkitAppRegion: 'no-drag' } as any}
              title="Minimize to compact view"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <svg className="w-2 h-0.5 text-yellow-900" fill="currentColor" viewBox="0 0 8 2">
                  <rect width="8" height="2" rx="1" />
                </svg>
              </div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.15, boxShadow: '0 0 12px rgba(52, 199, 89, 0.4)' }}
              whileTap={{ scale: 0.85 }}
              className="w-3 h-3 rounded-full bg-sky-success shadow-inner relative group transition-all duration-200"
              style={{ WebkitAppRegion: 'no-drag' } as any}
              title="Maximize"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <svg className="w-2 h-2 text-green-900" fill="none" viewBox="0 0 8 8">
                  <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M1 4l1.5 1.5M7 4l-1.5 1.5M4 1v6" />
                </svg>
              </div>
            </motion.button>
          </div>

          <h1 className="absolute left-1/2 transform -translate-x-1/2 text-sm font-semibold text-sky-text tracking-tight">
            {currentConversation?.title || 'Sky Assistant'}
          </h1>

          <div className="w-24" style={{ WebkitAppRegion: 'no-drag' } as any}>
            {/* Spacer for centering title */}
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 bg-white/20 backdrop-blur-sm">
          {isEmpty ? (
            <div className="h-full flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <div className="absolute inset-0 bg-sky-accent/10 rounded-full blur-3xl" />
                <div className="relative bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl rounded-3xl p-12 shadow-sky-lg border border-white/60">
                  <h2 className="text-2xl font-semibold text-sky-text mb-3 text-center">
                    Welcome to Sky Assistant
                  </h2>
                  <p className="text-sky-text-secondary text-center max-w-sm leading-relaxed">
                    I'm here to help you with anything you need. Start a conversation by typing a
                    message below.
                  </p>
                </div>
              </motion.div>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((message: any, index: number) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isLatest={index === messages.length - 1}
                />
              ))}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="rounded-br-sky-xl overflow-hidden">
          <MessageInput onSend={handleSendMessage} autoFocus={false} />
        </div>
      </div>

      {/* Calendar Modal */}
      <CalendarConfirmModal 
        isOpen={isCalendarModalOpen}
        parsedEvent={parsedCalendarEvent}
        onConfirm={handleCalendarConfirm}
        onCancel={handleCalendarCancel}
        isCreating={isCreatingEvent}
      />
    </motion.div>
  );
};
